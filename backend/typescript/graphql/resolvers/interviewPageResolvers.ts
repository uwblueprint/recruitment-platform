import InterviewCompositeService from "../../services/implementations/interviewCompositeService";
import InterviewedApplicantRecordsService from "../../services/implementations/interviewedApplicantRecordService";
import {
  Interview,
  InterviewedApplicantRecordDTO,
  InterviewedApplicantsDTO,
  InterviewPairingsDTO,
  UserDTO,
} from "../../types";

const interviewCompositeService = new InterviewCompositeService();
const interviewedApplicantRecordsService = new InterviewedApplicantRecordsService();

const interviewPageResolvers = {
  Query: {
    interviewedApplicantsByUserId: async (
      _parent: undefined,
      { userId }: { userId: string },
    ): Promise<InterviewedApplicantsDTO[]> => {
      return interviewCompositeService.getInterviewedApplicantsByUserId(userId);
    },
    interviewedPairingsByUserId: async (
      _parent: undefined,
      { userId }: { userId: string },
    ): Promise<InterviewPairingsDTO[]> => {
      return interviewCompositeService.getInterviewedPairingsByUserId(userId);
    },
    interviewersByGroupId: async (
      _parent: undefined,
      { groupId }: { groupId: string },
    ): Promise<UserDTO[]> => {
      return interviewCompositeService.getInterviewersByGroupId(groupId);
    },
    interviewedApplicantRecordByApplicantRecordId: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewedApplicantRecordsService.getInterviewedApplicantRecordByApplicantRecordId(
        applicantRecordId,
      );
    },
  },
  Mutation: {
    submitInterviewScores: async (
      _parent: undefined,
      { id, interviewJson }: { id: string; interviewJson: Interview },
    ): Promise<InterviewedApplicantRecordDTO> => {
      return interviewCompositeService.submitInterviewScores(id, interviewJson);
    },
  },
};

export default interviewPageResolvers;
