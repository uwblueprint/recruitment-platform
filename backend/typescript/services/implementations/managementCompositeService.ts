import Project from "../../models/project.model";
import User from "../../models/user.model";
import UserTermRecord from "../../models/userTermRecord.model";
import { MembersDashboardRowDTO } from "../../types/membersDashboard";
import { toMembersDashboardRowDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IManagementCompositeService from "../interfaces/IManagementCompositeService";

const Logger = logger(__filename);

class ManagementCompositeService implements IManagementCompositeService {
  /* eslint-disable class-methods-use-this */
  async getMembersDashboard(
    pageNumber: number,
    resultsPerPage: number,
  ): Promise<MembersDashboardRowDTO[]> {
    try {
      const perPage = Number.isFinite(Number(resultsPerPage))
        ? Number(resultsPerPage)
        : 1;
      const currentPage = Number.isFinite(Number(pageNumber))
        ? Number(pageNumber)
        : 1;
      const offsetRow = (currentPage - 1) * perPage;

      const members = await User.findAll({
        attributes: ["id", "first_name", "last_name", "is_archived"],
        include: [
          {
            model: UserTermRecord,
            as: "user_term_record",
            required: false,
            attributes: ["position_id", "createdAt"],
            include: [
              {
                model: Project,
                as: "project",
                required: false,
                attributes: ["project_name"],
              },
            ],
          },
        ],
        order: [["id", "ASC"]],
        limit: perPage,
        offset: offsetRow,
      });
      return members.map(toMembersDashboardRowDTO);
    } catch (error: unknown) {
      Logger.error(
        `failed to get members dashboard. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getMembersDashboardCount(): Promise<number> {
    try {
      return await User.count();
    } catch (error: unknown) {
      Logger.error(
        `Failed to get members dashboard count. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default ManagementCompositeService;
