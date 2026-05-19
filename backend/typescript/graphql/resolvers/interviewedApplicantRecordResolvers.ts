import InterviewedApplicantRecordsService from "../../services/implementations/interviewedApplicantRecordService";
import IInterviewedApplicantRecordsService from "../../services/interfaces/IInterviewedApplicantRecordService";
import {
  CreateInterviewedApplicantRecordDTO,
  InterviewedApplicantRecordDTO,
  UpdateInterviewedApplicantRecordDTO,
} from "../../types";

const interviewedApplicantRecordsService: IInterviewedApplicantRecordsService = new InterviewedApplicantRecordsService();

const interviewedApplicantRecordsResolvers = {
  Query: {
    interviewedApplicantRecord: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewedApplicantRecordsService.getInterviewedApplicantRecordById(
        id,
      );
    },
  },
  Mutation: {
    createInterviewedApplicantRecord: async (
      _parent: undefined,
      {
        interviewedApplicantRecord,
      }: { interviewedApplicantRecord: CreateInterviewedApplicantRecordDTO },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewedApplicantRecordsService.createInterviewedApplicantRecord(
        interviewedApplicantRecord,
      );
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
      return interviewedApplicantRecordsService.updateInterviewedApplicantRecord(
        id,
        interviewedApplicantRecord,
      );
    },

    deleteInterviewedApplicantRecordById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewedApplicantRecordsService.deleteInterviewedApplicantRecordById(
        id,
      );
    },
  },
};

export default interviewedApplicantRecordsResolvers;
