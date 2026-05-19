import InterviewCompositeService from "../../services/implementations/interviewCompositeService";
import IInterviewCompositeService from "../../services/interfaces/IInterviewCompositeService";
import { InterviewDelegationDTO } from "../../types";

const interviewCompositeService: IInterviewCompositeService = new InterviewCompositeService();

const interviewDashboardResolvers = {
  Mutation: {
    delegateInterviewers: async (
      _parent: undefined,
      { positions }: { positions: string[] },
    ): Promise<InterviewDelegationDTO[]> => {
      return interviewCompositeService.delegateInterviewers(positions);
    },
  },
};

export default interviewDashboardResolvers;
