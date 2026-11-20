import InterviewedApplicantRecordsService from "../../services/implementations/interviewedApplicantRecordService";
import IInterviewedApplicantRecordsService from "../../services/interfaces/IInterviewedApplicantRecordService";
import {
  CreateInterviewedApplicantRecordDTO,
  Interview,
  InterviewedApplicantRecordDTO,
  UpdateInterviewedApplicantRecordDTO,
} from "../../types";

const interviewedApplicantRecordsService: IInterviewedApplicantRecordsService = new InterviewedApplicantRecordsService();

const interviewedApplicantRecordsResolvers = {
  Query: {
    interviewedApplicantRecord: async (
      _parent: undefined,
      {
        interviewedApplicantRecordId,
      }: { interviewedApplicantRecordId: string },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewedApplicantRecordsService.getInterviewedApplicantRecordById(
        interviewedApplicantRecordId,
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
        interviewedApplicantRecordId,
        interviewedApplicantRecord,
      }: {
        interviewedApplicantRecordId: string;
        interviewedApplicantRecord: UpdateInterviewedApplicantRecordDTO;
      },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewedApplicantRecordsService.updateInterviewedApplicantRecord(
        interviewedApplicantRecordId,
        interviewedApplicantRecord,
      );
    },

    deleteInterviewedApplicantRecordById: async (
      _parent: undefined,
      {
        interviewedApplicantRecordId,
      }: { interviewedApplicantRecordId: string },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewedApplicantRecordsService.deleteInterviewedApplicantRecordById(
        interviewedApplicantRecordId,
      );
    },

    submitInterviewScores: async (
      _parent: undefined,
      {
        interviewedApplicantRecordId,
        interviewJson,
      }: { interviewedApplicantRecordId: string; interviewJson: Interview },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewedApplicantRecordsService.updateInterviewedApplicantRecord(
        interviewedApplicantRecordId,
        { interviewJson },
      );
    },
  },
};

export default interviewedApplicantRecordsResolvers;
