import {
  MembersDashboardRowDTO,
  MembersDashboardSidePanelDTO,
} from "../../types/membersDashboard";

interface IManagementCompositeService {
  /**
   * Pagination-supporting viewing of the members management dashboard
   * @Param pageNumber the page the viewer is on
   * @Param resultsPerPage the number of results per page
   */
  getMembersDashboard(
    pageNumber: number,
    resultsPerPage: number,
  ): Promise<MembersDashboardRowDTO[]>;

  /**
   * Gets the total number of members shown on the members dashboard
   */
  getMembersDashboardCount(): Promise<number>;

  /**
   * Gets the members management side panel showing member information
   */
  getMembersDashboardSidePanel(
    userId: number,
  ): Promise<MembersDashboardSidePanelDTO>;
}

export default IManagementCompositeService;
