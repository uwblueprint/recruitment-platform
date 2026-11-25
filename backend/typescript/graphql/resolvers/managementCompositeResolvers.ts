import ManagementCompositeService from "../../services/implementations/managementCompositeService";
import {
  MembersDashboardRowDTO,
  MembersDashboardSidePanelDTO,
  TeamsDashboardTeamDTO,
} from "../../types";

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
      { isArchived }: { isArchived: boolean | null },
    ): Promise<TeamsDashboardTeamDTO[]> =>
      managementCompositeService.getTeamsDashboard(isArchived ?? null),
    membersDashboardSidePanel: (
      _parent: undefined,
      { userId }: { userId: number },
    ): Promise<MembersDashboardSidePanelDTO> => {
      return managementCompositeService.getMembersDashboardSidePanel(userId);
    },
  },
};

export default managementCompositeResolvers;
