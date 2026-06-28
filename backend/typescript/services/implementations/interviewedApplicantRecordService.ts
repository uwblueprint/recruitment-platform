import {
  CreateInterviewedApplicantRecordDTO,
  Interview,
  InterviewedApplicantRecordDTO,
  InterviewStatusEnum,
  UpdateInterviewedApplicantRecordDTO,
} from "../../types";
import IInterviewedApplicantRecordsService from "../interfaces/IInterviewedApplicantRecordService";
import InterviewedApplicantRecord from "../../models/interviewedApplicantRecord.model";
import { toInterviewedApplicantRecordDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

function isValidInterviewScores(interviewJson: Interview): boolean {
  const scores = {
    passionFSG: interviewJson.passionFSG,
    teamPlayer: interviewJson.teamPlayer,
    desireToLearn: interviewJson.desireToLearn,
    skill: interviewJson.skill,
  };

  return !Object.entries(scores).some(
    ([, value]) => value && (value < 1 || value > 5),
  );
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
      return toInterviewedApplicantRecordDTO(record);
    } catch (error: unknown) {
      Logger.error(
        `Failed to fetch interviewed applicant record. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getInterviewedApplicantRecordByApplicantRecordId(
    applicantRecordId: string,
  ): Promise<InterviewedApplicantRecordDTO> {
    try {
      const record = await InterviewedApplicantRecord.findOne({
        where: { applicant_record_id: applicantRecordId },
      });
      if (!record) {
        throw new Error(
          `No interviewed applicant record with applicant record id ${applicantRecordId} found.`,
        );
      }
      return toInterviewedApplicantRecordDTO(record);
    } catch (error: unknown) {
      Logger.error(
        `Failed to fetch interviewed applicant record by applicant record id. Reason = ${getErrorMessage(
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
      return toInterviewedApplicantRecordDTO(record);
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
    t?: any,
  ): Promise<InterviewedApplicantRecordDTO> {
    try {
      const record: InterviewedApplicantRecord | null = await InterviewedApplicantRecord.findByPk(
        id,
      );
      if (!record) {
        throw new Error(`No interviewed applicant record with id ${id} found.`);
      }

      if (
        interviewedApplicantRecord.interviewJson &&
        !isValidInterviewScores(interviewedApplicantRecord.interviewJson)
      ) {
        throw new Error(
          "Invalid interview scores. Scores must be between 1 and 5.",
        );
      }

      const updatedInterviewJson = {
        ...(record.interview_json ?? {}),
        ...interviewedApplicantRecord.interviewJson,
      };

      const {
        passionFSG,
        teamPlayer,
        desireToLearn,
        skill,
      } = updatedInterviewJson;

      let calculatedScore = 0;
      if (passionFSG) calculatedScore += passionFSG;
      if (teamPlayer) calculatedScore += teamPlayer;
      if (desireToLearn) calculatedScore += desireToLearn;
      if (skill) calculatedScore += skill;
      const updatedScore = calculatedScore > 0 ? calculatedScore : null;

      await record.update({
        score: updatedScore,
        interview_json: updatedInterviewJson,
        status: interviewedApplicantRecord.status,
        interview_notes_id: interviewedApplicantRecord.interviewNotesId,
        interview_date: interviewedApplicantRecord.interviewDate,
      });
      return toInterviewedApplicantRecordDTO(record);
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
      return toInterviewedApplicantRecordDTO(record);
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
