import { DepartmentDTO } from "../../types";

interface IDepartmentService {
  /**
   * Get the non-archived departments the dashboards can be scoped to.
   * @returns the array of DepartmentDTOs
   * @throws Error if departments retrieval fails
   */
  getDepartments(): Promise<DepartmentDTO[]>;
}

export default IDepartmentService;
