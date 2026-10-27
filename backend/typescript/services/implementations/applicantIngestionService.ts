import { Op } from "sequelize";

import {
  FirebaseApplication,
  PopulateApplicantRecordsResult,
} from "../../types";
import { fetchApplicationsByTerm } from "../../utilities/applicantFirebaseClient";
import {
  ParsedApplication,
  parseFirebaseApplication,
} from "../../utilities/applicantIngestUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import { sequelize } from "../../models";
import Applicant from "../../models/applicant.model";
import ApplicantRecord from "../../models/applicantRecord.model";
import Position from "../../models/position.model";
import IApplicantIngestionService from "../interfaces/IApplicantIngestionService";

const Logger = logger(__filename);

class ApplicantIngestionService implements IApplicantIngestionService {
  /* eslint-disable class-methods-use-this */

  fetchApplications: (term: string) => Promise<FirebaseApplication[]>;

  constructor(
    fetchApplications: (
      term: string,
    ) => Promise<FirebaseApplication[]> = fetchApplicationsByTerm,
  ) {
    this.fetchApplications = fetchApplications;
  }

  async populateApplicantRecords(
    term: string,
  ): Promise<PopulateApplicantRecordsResult> {
    try {
      const trimmedTerm = term.trim();
      if (!trimmedTerm) {
        throw new Error("A term is required.");
      }

      const applications = await this.fetchApplications(trimmedTerm);

      const parseErrors: string[] = [];
      const parsed: ParsedApplication[] = [];
      applications.forEach((application) => {
        try {
          parsed.push(parseFirebaseApplication(application));
        } catch (error: unknown) {
          parseErrors.push(
            `${application?.email ?? "<unknown email>"}: ${getErrorMessage(
              error,
            )}`,
          );
        }
      });
      if (parseErrors.length > 0) {
        throw new Error(
          `Failed to parse ${
            parseErrors.length
          } application(s): ${parseErrors.join("; ")}`,
        );
      }

      const existingEmails = new Set(
        (
          await Applicant.findAll({
            attributes: ["email"],
            where: {
              term: trimmedTerm,
              email: { [Op.in]: parsed.map((p) => p.applicant.email) },
            },
          })
        ).map((a) => a.email.toLowerCase()),
      );

      const skippedExistingEmails: string[] = [];
      const toCreate = parsed.filter(({ applicant }) => {
        const key = applicant.email.toLowerCase();
        if (existingEmails.has(key)) {
          skippedExistingEmails.push(applicant.email);
          return false;
        }
        // Also drops repeat submissions within the same Firebase batch.
        existingEmails.add(key);
        return true;
      });

      const requiredPositions = new Set(
        toCreate.flatMap((p) => p.applicantRecords.map((r) => r.position)),
      );
      const knownPositions = new Set(
        (
          await Position.findAll({
            attributes: ["title"],
            where: { title: { [Op.in]: [...requiredPositions] } },
          })
        ).map((p) => p.title),
      );
      const missingPositions = [...requiredPositions].filter(
        (title) => !knownPositions.has(title),
      );
      if (missingPositions.length > 0) {
        throw new Error(
          `No matching position for role(s): ${missingPositions.join(
            ", ",
          )}. Add them to the positions table (or the export-role mapping) and retry.`,
        );
      }

      let applicantRecordsCreated = 0;
      await sequelize.transaction(async (transaction) => {
        const applicants = await Applicant.bulkCreate(
          toCreate.map((p) => p.applicant),
          { transaction },
        );
        const applicantRecords = toCreate.flatMap((p, i) =>
          p.applicantRecords.map((record) => ({
            ...record,
            applicant_id: applicants[i].id,
          })),
        );
        await ApplicantRecord.bulkCreate(applicantRecords, { transaction });
        applicantRecordsCreated = applicantRecords.length;
      });

      Logger.info(
        `Ingested term = ${trimmedTerm}: ${toCreate.length} applicants, ${applicantRecordsCreated} applicant records, ${skippedExistingEmails.length} skipped.`,
      );
      return {
        term: trimmedTerm,
        applicantsCreated: toCreate.length,
        applicantRecordsCreated,
        skippedExistingEmails,
      };
    } catch (error: unknown) {
      Logger.error(
        `Failed to populate applicant records for term = ${term}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default ApplicantIngestionService;
