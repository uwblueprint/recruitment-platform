import {
  AdminCommentDTO,
  CreateAdminCommentDTO,
  UpdateAdminCommentDTO,
} from "../../types";

interface IAdminCommentService {
  /**
   * Get admin comments associated with applicant record id
   * @param applicantRecordId applicant record id
   * @returns the array of AdminCommentDTOs
   * @throws Error if admin comments retrieval fails
   */
  getAdminCommentsByApplicantRecordId(
    applicantRecordId: string,
  ): Promise<AdminCommentDTO[]>;

  /**
   * Get admin comment associated with id
   * @param id admin comment id
   * @returns the AdminCommentDTO
   * @throws Error if admin comment retrieval fails
   */
  getAdminCommentById(id: string): Promise<AdminCommentDTO>;

  /**
   * Create a admin comment
   * @param adminComment the admin comment to be created
   * @returns the created AdminCommentDTO
   * @throws Error if admin comment creation fails
   */
  createAdminComment(
    adminComment: CreateAdminCommentDTO,
  ): Promise<AdminCommentDTO>;

  /**
   * Update a admin comment
   * @param id admin comment id
   * @param adminComment the admin comment to be updated
   * @returns the updated AdminCommentDTO
   * @throws Error if admin comment update fails
   */
  updateAdminComment(
    id: string,
    adminComment: UpdateAdminCommentDTO,
  ): Promise<AdminCommentDTO>;

  /**
   * Delete a admin comment associated with id
   * @param id admin comment id
   * @returns the deleted AdminCommentDTO
   * @throws Error if admin comment deletion fails
   */
  deleteAdminCommentById(id: string): Promise<AdminCommentDTO>;
}

export default IAdminCommentService;
