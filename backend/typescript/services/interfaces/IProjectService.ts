import { ProjectDTO } from "../../types";

interface IProjectService {
  /**
   * Get projects, optionally filtered by archived status.
   * @param isArchived - true for archived, false for non-archived; omit for all projects.
   * @returns the array of ProjectDTOs
   * @throws Error if projects retrieval fails
   */
  getAllProjects(isArchived?: boolean): Promise<ProjectDTO[]>;
}

export default IProjectService;
