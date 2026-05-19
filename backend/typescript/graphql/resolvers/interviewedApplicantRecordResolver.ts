import InterviewedApplicantRecordsService from "../../services/implementations/interviewedApplicantRecordService";
import IInterviewedApplicantRecordsService from "../../services/interfaces/IInterviewedApplicantRecordService";
import {
  CreateInterviewedApplicantRecordDTO,
  InterviewedApplicantRecordDTO,
  UpdateInterviewedApplicantRecordDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";

const interviewedApplicantRecordsService: IInterviewedApplicantRecordsService = new InterviewedApplicantRecordsService();

const interviewedApplicantRecordsResolvers = {
  Query: {
    getInterviewedApplicantRecordById: async (
      _parent: undefined,
      args: { id: string },
    ): Promise<InterviewedApplicantRecordDTO> => {
      try {
        return await interviewedApplicantRecordsService.getInterviewedApplicantRecordById(
          args.id,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
  Mutation: {
    createInterviewedApplicantRecord: async (
      _parent: undefined,
      {
        interviewedApplicantRecord,
      }: { interviewedApplicantRecord: CreateInterviewedApplicantRecordDTO },
    ): Promise<InterviewedApplicantRecordDTO> => {
      try {
        return await interviewedApplicantRecordsService.createInterviewedApplicantRecord(
          interviewedApplicantRecord,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    updateInterviewedApplicantRecord: async (
      _parent: undefined,
      {
        id,
        interviewedApplicantRecord,
      }: {
        id: string;
        interviewedApplicantRecord: UpdateInterviewedApplicantRecordDTO;
      },
    ): Promise<InterviewedApplicantRecordDTO> => {
      try {
        return await interviewedApplicantRecordsService.updateInterviewedApplicantRecord(
          id,
          interviewedApplicantRecord,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },

    deleteInterviewedApplicantRecordById: async (
      _parent: undefined,
      args: { id: string },
    ): Promise<InterviewedApplicantRecordDTO> => {
      try {
        return await interviewedApplicantRecordsService.deleteInterviewedApplicantRecordById(
          args.id,
        );
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  },
};

export default interviewedApplicantRecordsResolvers;
