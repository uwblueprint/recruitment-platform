import {
  ApplicantRecordDTO,
  BulkUpdateApplicantRecordDTO,
  CreateApplicantRecordDTO,
  UpdateApplicantRecordDTO,
} from "../../types";
import { toApplicantRecordDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import ApplicantRecord from "../../models/applicantRecord.model";
import IApplicantRecordService from "../interfaces/IApplicantRecordService";
import { sequelize } from "../../models";

const Logger = logger(__filename);

class ApplicantRecordService implements IApplicantRecordService {
  /* eslint-disable class-methods-use-this */

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
}

export default ApplicantRecordService;
