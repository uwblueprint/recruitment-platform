import {
  ApplicantRecordDTO,
  BulkEmailResult,
  ApplicationStatusEnum,
  BulkUpdateApplicantRecordDTO,
  CreateApplicantRecordDTO,
  UpdateApplicantRecordDTO,
} from "../../types";
import { toApplicantRecordDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import Applicant from "../../models/applicant.model";
import ApplicantRecord from "../../models/applicantRecord.model";
import IApplicantRecordService from "../interfaces/IApplicantRecordService";
import IEmailService from "../interfaces/emailService";
import { buildRejectionEmail } from "../../emails";
import { sequelize } from "../../models";

const Logger = logger(__filename);

class ApplicantRecordService implements IApplicantRecordService {
  /* eslint-disable class-methods-use-this */

  emailService: IEmailService | null;

  constructor(emailService: IEmailService | null = null) {
    this.emailService = emailService;
  }

  async getApplicantRecordById(id: string): Promise<ApplicantRecordDTO> {
    try {
      const applicantRecord = await ApplicantRecord.findByPk(id);
      if (!applicantRecord) {
        throw new Error(`ApplicantRecord with id ${id} not found.`);
      }
      return toApplicantRecordDTO(applicantRecord);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get applicant record by id = ${id}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async createApplicantRecord(
    applicantRecord: CreateApplicantRecordDTO,
  ): Promise<ApplicantRecordDTO> {
    try {
      const newApplicantRecord = await ApplicantRecord.create({
        applicant_id: applicantRecord.applicantId,
        position: applicantRecord.position,
        role_specific_questions: applicantRecord.roleSpecificQuestions,
        choice: applicantRecord.choice,
        status: applicantRecord.status,
        skill_category: applicantRecord.skillCategory,
        combined_review_score: applicantRecord.combinedReviewScore,
        is_applicant_flagged: applicantRecord.isApplicantFlagged,
      });
      return toApplicantRecordDTO(newApplicantRecord);
    } catch (error: unknown) {
      Logger.error(
        `Failed to create applicant record. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateApplicantRecord(
    id: string,
    applicantRecord: UpdateApplicantRecordDTO,
  ): Promise<ApplicantRecordDTO> {
    try {
      const applicantRecordToUpdate = await ApplicantRecord.findByPk(id);
      if (!applicantRecordToUpdate) {
        throw new Error(`ApplicantRecord with id ${id} not found.`);
      }
      const updatedApplicantRecord = await applicantRecordToUpdate.update({
        status: applicantRecord.status,
        skill_category: applicantRecord.skillCategory,
        combined_review_score: applicantRecord.combinedReviewScore,
        is_applicant_flagged: applicantRecord.isApplicantFlagged,
      });
      return toApplicantRecordDTO(updatedApplicantRecord);
    } catch (error: unknown) {
      Logger.error(
        `Failed to update applicant record. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteApplicantRecordById(id: string): Promise<ApplicantRecordDTO> {
    try {
      const applicantRecord = await ApplicantRecord.findByPk(id);
      if (!applicantRecord) {
        throw new Error(`ApplicantRecord with id ${id} not found.`);
      }
      await applicantRecord.destroy();
      return toApplicantRecordDTO(applicantRecord);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete applicant record. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async bulkCreateApplicantRecords(
    applicantRecords: CreateApplicantRecordDTO[],
  ): Promise<ApplicantRecordDTO[]> {
    const transaction = await sequelize.transaction();
    try {
      const applicantRecordsToCreate = applicantRecords.map(
        (applicantRecord) => ({
          applicant_id: applicantRecord.applicantId,
          position: applicantRecord.position,
          role_specific_questions: applicantRecord.roleSpecificQuestions,
          choice: applicantRecord.choice,
          status: applicantRecord.status,
          skill_category: applicantRecord.skillCategory,
          combined_review_score: applicantRecord.combinedReviewScore,
          is_applicant_flagged: applicantRecord.isApplicantFlagged,
        }),
      );

      const results = await ApplicantRecord.bulkCreate(
        applicantRecordsToCreate,
        {
          returning: true,
          transaction,
        },
      );
      await transaction.commit();
      return results.map(toApplicantRecordDTO);
    } catch (error: unknown) {
      await transaction.rollback();
      Logger.error(
        `Failed to bulk create applicant records. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async bulkUpdateApplicantRecords(
    applicantRecords: BulkUpdateApplicantRecordDTO[],
  ): Promise<ApplicantRecordDTO[]> {
    const transaction = await sequelize.transaction();
    try {
      const results = await Promise.all(
        applicantRecords.map(async (record) => {
          const { id, ...updates } = record;
          const row = await ApplicantRecord.findByPk(id, { transaction });
          if (!row) {
            throw new Error(`ApplicantRecord with id ${id} not found.`);
          }
          return row.update(
            {
              status: updates.status,
              skill_category: updates.skillCategory,
              combined_review_score: updates.combinedReviewScore,
              is_applicant_flagged: updates.isApplicantFlagged,
            },
            { transaction },
          );
        }),
      );

      await transaction.commit();

      return results.map(toApplicantRecordDTO);
    } catch (error: unknown) {
      await transaction.rollback();
      Logger.error(
        `Failed to bulk update applicant records. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  /**
   * Send a templated rejection email to the applicant of each given record.
   * Called explicitly by the mail mutation, independently of status updates.
   */
  async sendRejectionEmails(
    applicantRecordIds: string[],
  ): Promise<BulkEmailResult> {
    if (!this.emailService) {
      throw new Error("Rejection email service is not configured.");
    }

    try {
      const ids = [...new Set(applicantRecordIds)];
      const records = await ApplicantRecord.findAll({
        where: { id: ids },
        include: [Applicant],
      });
      if (records.length !== ids.length) {
        throw new Error("One or more applicant records were not found.");
      }
      if (
        records.some(
          (record) => record.status !== ApplicationStatusEnum.REJECTED,
        )
      ) {
        throw new Error("Rejection emails require rejected applicant records.");
      }
      const messages = records.map((record) => {
        const { subject, html } = buildRejectionEmail({
          firstName: record.applicant.first_name,
          position: record.position,
          term: record.applicant.term,
        });
        return { to: record.applicant.email, subject, htmlBody: html };
      });

      const result = await this.emailService.sendBulkEmail(messages);
      const { failed } = result;
      if (failed.length > 0) {
        Logger.error(
          `Failed to send rejection emails to: ${failed
            .map((failure) => failure.to)
            .join(", ")}`,
        );
      }
      return result;
    } catch (error: unknown) {
      Logger.error(
        `Failed to send rejection emails. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default ApplicantRecordService;
