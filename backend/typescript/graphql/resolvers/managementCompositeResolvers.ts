import ManagementCompositeService from "../../services/implementations/managementCompositeService";
import { MembersDashboardRowDTO, TeamsDashboardTeamDTO } from "../../types";

const managementCompositeService = new ManagementCompositeService();

const managementCompositeResolvers = {
  Query: {
    membersDashboard: async (
      _parent: undefined,
      {
        pageNumber,
        resultsPerPage,
      }: { pageNumber: number; resultsPerPage: number },
    ): Promise<MembersDashboardRowDTO[]> =>
      managementCompositeService.getMembersDashboard(
        pageNumber,
        resultsPerPage,
      ),
    membersDashboardCount: (): Promise<number> =>
      managementCompositeService.getMembersDashboardCount(),
    teamsDashboard: (
      _parent: undefined,
      { isArchived }: { isArchived?: boolean | null },
    ): Promise<TeamsDashboardTeamDTO[]> =>
      managementCompositeService.getTeamsDashboard(isArchived ?? null),
  },
};

export default managementCompositeResolvers;
