import {
  AdminCommentDTO,
  CreateAdminCommentDTO,
  UpdateAdminCommentDTO,
} from "../../types";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import AdminComment from "../../models/adminComment.model";
import IAdminCommentService from "../interfaces/IAdminCommentService";

const Logger = logger(__filename);

function toDTO(adminComment: AdminComment): AdminCommentDTO {
  return {
    id: adminComment.id,
    userId: adminComment.user_id,
    applicantRecordId: adminComment.applicant_record_id,
    comment: adminComment.comment,
    createdAt: adminComment.createdAt.toISOString(),
    updatedAt: adminComment.updatedAt.toISOString(),
  };
}

class AdminCommentService implements IAdminCommentService {
  /* eslint-disable class-methods-use-this */

  async getAdminCommentsByApplicantRecordId(
    applicantRecordId: string,
  ): Promise<AdminCommentDTO[]> {
    try {
      const adminComments = await AdminComment.findAll({
        where: { applicant_record_id: applicantRecordId },
      });
      return adminComments.map(toDTO);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get admin comments by applicantRecordId = ${applicantRecordId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getAdminCommentById(id: string): Promise<AdminCommentDTO> {
    try {
      const adminComment = await AdminComment.findByPk(id);
      if (!adminComment) {
        throw new Error(`adminCommentId ${id} not found.`);
      }
      return toDTO(adminComment);
    } catch (error: unknown) {
      Logger.error(
        `Failed to get admin comment by id = ${id}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async createAdminComment(
    adminComment: CreateAdminCommentDTO,
  ): Promise<AdminCommentDTO> {
    try {
      const newAdminComment = await AdminComment.create({
        user_id: adminComment.userId,
        applicant_record_id: adminComment.applicantRecordId,
        comment: adminComment.comment,
      });
      return toDTO(newAdminComment);
    } catch (error: unknown) {
      Logger.error(
        `Failed to create admin comment. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateAdminComment(
    id: string,
    adminComment: UpdateAdminCommentDTO,
  ): Promise<AdminCommentDTO> {
    try {
      const adminCommentToUpdate = await AdminComment.findByPk(id);
      if (!adminCommentToUpdate) {
        throw new Error(`adminCommentId ${id} not found.`);
      }

      const updatedAdminComment = await adminCommentToUpdate.update({
        comment: adminComment.comment,
      });
      return toDTO(updatedAdminComment);
    } catch (error: unknown) {
      Logger.error(
        `Failed to update admin comment. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteAdminCommentById(id: string): Promise<AdminCommentDTO> {
    try {
      const adminComment = await AdminComment.findByPk(id);
      if (!adminComment) {
        throw new Error(`adminCommentId ${id} not found.`);
      }
      await adminComment.destroy();
      return toDTO(adminComment);
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete admin comment. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default AdminCommentService;
