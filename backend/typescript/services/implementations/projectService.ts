import Project from "../../models/project.model";
import { ProjectDTO } from "../../types";
import { toProjectDTO } from "../../utilities/dtoUtils";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IProjectService from "../interfaces/IProjectService";

const Logger = logger(__filename);

class ProjectService implements IProjectService {
  /* eslint-disable class-methods-use-this */

  async getAllProjects(isArchived?: boolean): Promise<ProjectDTO[]> {
    try {
      const projects = await Project.findAll({
        where: isArchived !== undefined ? { is_archived: isArchived } : {},
        order: [["project_name", "ASC"]],
      });
      return projects.map(toProjectDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get projects. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default ProjectService;
