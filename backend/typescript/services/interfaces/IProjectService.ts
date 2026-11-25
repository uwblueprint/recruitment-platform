import { ProjectDTO } from "../../types";

interface IProjectService {
  /**
   * Get projects, optionally filtered by archived status.
   * @param isArchived - true for archived, false for non-archived; omit for all projects.
   * @returns the array of ProjectDTOs
   * @throws Error if projects retrieval fails
   */
  getAllProjects(isArchived?: boolean): Promise<ProjectDTO[]>;

  /**
   * Mark a project as archived.
   * @param id the project id
   * @returns the updated ProjectDTO
   * @throws Error if the project does not exist or the update fails
   */
  archiveProject(id: string): Promise<ProjectDTO>;
}

export default IProjectService;
