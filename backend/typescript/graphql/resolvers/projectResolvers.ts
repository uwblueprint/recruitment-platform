import ProjectService from "../../services/implementations/projectService";
import IProjectService from "../../services/interfaces/IProjectService";
import { ProjectDTO } from "../../types";

const projectService: IProjectService = new ProjectService();

const projectResolvers = {
  Query: {
    projects: async (
      _parent: unknown,
      { isArchived }: { isArchived?: boolean },
    ): Promise<ProjectDTO[]> => {
      return projectService.getAllProjects(isArchived ?? undefined);
    },
  },
  Mutation: {
    archiveProject: (
      _parent: unknown,
      { id }: { id: string },
    ): Promise<ProjectDTO> => projectService.archiveProject(id),
  },
};

export default projectResolvers;
