import { ApplicantDTO } from "../../types";

interface IApplicantService {
  /**
   * Get applicant associated with id
   * @param id applicant id
   * @returns the ApplicantDTO
   * @throws Error if applicant retrieval fails
   */
  getApplicantById(id: string): Promise<ApplicantDTO>;
}

export default IApplicantService;
