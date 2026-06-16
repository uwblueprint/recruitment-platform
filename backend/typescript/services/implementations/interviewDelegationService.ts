import { sequelize } from "../../models";
import InterviewDelegation from "../../models/interviewDelegation.model";
import {
  CreateInterviewDelegationDTO,
  InterviewDelegationDTO,
  UpdateInterviewDelegationDTO,
} from "../../types";
import { toInterviewDelegationDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IInterviewDelegationsService from "../interfaces/IInterviewDelegationService";

const Logger = logger(__filename);

class InterviewDelegationsService implements IInterviewDelegationsService {
  /* eslint-disable class-methods-use-this */
  async createInterviewDelegation(
    interviewDelegation: CreateInterviewDelegationDTO,
  ): Promise<InterviewDelegationDTO> {
    try {
      const newDelegation = await InterviewDelegation.create({
        interviewed_applicant_record_id:
          interviewDelegation.interviewedApplicantRecordId,
        interviewer_id: Number(interviewDelegation.interviewerId),
        group_id: interviewDelegation.groupId,
      });
      return toInterviewDelegationDTO(newDelegation);
    } catch (error: unknown) {
      Logger.error(
        `Failed to create interview delegation. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async updateInterviewDelegation(
    interviewedApplicantRecordId: string,
    interviewerId: string,
    interviewDelegation: UpdateInterviewDelegationDTO,
    t?: any,
  ): Promise<InterviewDelegationDTO> {
    try {
      const existingDelegation = await InterviewDelegation.findOne({
        where: {
          interviewed_applicant_record_id: interviewedApplicantRecordId,
          interviewer_id: Number(interviewerId),
        },
      });
      if (!existingDelegation) {
        throw new Error(
          `Interview delegation not found for interviewedApplicantRecordId: ${interviewedApplicantRecordId} and interviewerId: ${interviewerId}`,
        );
      }

      const updatedDelegation = await existingDelegation.update({
        interview_has_conflict: interviewDelegation.interviewHasConflict,
      });
      return toInterviewDelegationDTO(updatedDelegation);
    } catch (error: unknown) {
      Logger.error(
        `Failed to update interview delegation. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getInterviewDelegation(
    interviewedApplicantRecordId: string,
    interviewerId: string,
  ): Promise<InterviewDelegationDTO> {
    try {
      const delegation = await InterviewDelegation.findOne({
        where: {
          interviewed_applicant_record_id: interviewedApplicantRecordId,
          interviewer_id: Number(interviewerId),
        },
      });
      if (!delegation) {
        throw new Error(
          `No interview delegation found for interviewedApplicantRecordId: ${interviewedApplicantRecordId} and interviewerId: ${interviewerId}`,
        );
      }
      return toInterviewDelegationDTO(delegation);
    } catch (error: unknown) {
      Logger.error(
        `Failed to fetch interview delegation. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async deleteInterviewDelegation(
    interviewedApplicantRecordId: string,
    interviewerId: string,
  ): Promise<InterviewDelegationDTO> {
    try {
      const delegation = await InterviewDelegation.findOne({
        where: {
          interviewed_applicant_record_id: interviewedApplicantRecordId,
          interviewer_id: Number(interviewerId),
        },
      });
      if (!delegation) {
        throw new Error(
          `No interview delegation found for interviewedApplicantRecordId: ${interviewedApplicantRecordId} and interviewerId: ${interviewerId}`,
        );
      }
      await delegation.destroy();
      return toInterviewDelegationDTO(delegation);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete interview delegation. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async bulkCreateInterviewDelegations(
    delegations: CreateInterviewDelegationDTO[],
  ): Promise<InterviewDelegationDTO[]> {
    const t = await sequelize.transaction();
    try {
      const createdDelegations = await InterviewDelegation.bulkCreate(
        delegations.map((delegation) => ({
          interviewed_applicant_record_id:
            delegation.interviewedApplicantRecordId,
          interviewer_id: Number(delegation.interviewerId),
          group_id: delegation.groupId,
        })),
        { transaction: t },
      );

      await t.commit();
      return createdDelegations.map(toInterviewDelegationDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to bulk create interview delegations. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      await t.rollback();
      throw error;
    }
  }
}

export default InterviewDelegationsService;
