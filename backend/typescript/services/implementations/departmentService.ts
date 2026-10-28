import Department from "../../models/department.model";
import { DepartmentDTO } from "../../types";
import { toDepartmentDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IDepartmentService from "../interfaces/IDepartmentService";

const Logger = logger(__filename);

class DepartmentService implements IDepartmentService {
  /* eslint-disable class-methods-use-this */

  async getDepartments(): Promise<DepartmentDTO[]> {
    try {
      const departments = await Department.findAll({
        where: { is_archived: false },
        order: [["name", "ASC"]],
      });
      return departments.map(toDepartmentDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get departments. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default DepartmentService;
