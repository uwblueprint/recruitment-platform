import {
  CreateInterviewedApplicantRecordDTO,
  InterviewedApplicantRecordDTO,
  InterviewStatusEnum,
  UpdateInterviewedApplicantRecordDTO,
} from "../../types";
import IInterviewedApplicantRecordsService from "../interfaces/IInterviewedApplicantRecordService";
import InterviewedApplicantRecord from "../../models/interviewedApplicantRecord.model";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

function toDTO(
  model: InterviewedApplicantRecord,
): InterviewedApplicantRecordDTO {
  return {
    id: model.id,
    applicantRecordId: model.applicant_record_id,
    score: model.score,
    interviewJson: model.interview_json,
    status: model.status,
    interviewNotesId: model.interview_notes_id,
    interviewDate: model.interview_date,
  };
}

class InterviewedApplicantRecordsService
  implements IInterviewedApplicantRecordsService {
  /* eslint-disable class-methods-use-this */
  async getInterviewedApplicantRecordById(
    id: string,
  ): Promise<InterviewedApplicantRecordDTO> {
    try {
      const record: InterviewedApplicantRecord | null = await InterviewedApplicantRecord.findByPk(
        id,
      );
      if (!record) {
        throw new Error(`No interviewed applicant record with id ${id} found.`);
      }
      return toDTO(record);
    } catch (error: unknown) {
      Logger.error(
        `Failed to fetch interviewed applicant record. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async createInterviewedApplicantRecord(
    interviewedApplicantRecord: CreateInterviewedApplicantRecordDTO,
  ): Promise<InterviewedApplicantRecordDTO> {
    try {
      const record: InterviewedApplicantRecord = await InterviewedApplicantRecord.create(
        {
          applicant_record_id: interviewedApplicantRecord.applicantRecordId,
          status: InterviewStatusEnum.NEEDS_REVIEW,
        },
      );
      return toDTO(record);
    } catch (error: unknown) {
      Logger.error(
        `Failed to create interviewed applicant record. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async updateInterviewedApplicantRecord(
    id: string,
    interviewedApplicantRecord: UpdateInterviewedApplicantRecordDTO,
  ): Promise<InterviewedApplicantRecordDTO> {
    try {
      const record: InterviewedApplicantRecord | null = await InterviewedApplicantRecord.findByPk(
        id,
      );
      if (!record) {
        throw new Error(`No interviewed applicant record with id ${id} found.`);
      }

      await record.update({
        score: interviewedApplicantRecord.score,
        interview_json: interviewedApplicantRecord.interviewJson,
        status: interviewedApplicantRecord.status,
        interview_notes_id: interviewedApplicantRecord.interviewNotesId,
        interview_date: interviewedApplicantRecord.interviewDate,
      });
      return toDTO(record);
    } catch (error: unknown) {
      Logger.error(
        `Failed to update interviewed applicant record. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async deleteInterviewedApplicantRecordById(
    id: string,
  ): Promise<InterviewedApplicantRecordDTO> {
    try {
      const record = await InterviewedApplicantRecord.findByPk(id);
      if (!record) {
        throw new Error(`No interviewed applicant record with id ${id} found.`);
      }
      await record.destroy();
      return toDTO(record);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete interviewed applicant record. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default InterviewedApplicantRecordsService;
