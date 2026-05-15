import AdminCommentService from "../../services/implementations/adminCommentService";
import IAdminCommentService from "../../services/interfaces/IAdminCommentService";
import {
  CreateAdminCommentDTO,
  AdminCommentDTO,
  UpdateAdminCommentDTO,
} from "../../types";

const adminCommentService: IAdminCommentService = new AdminCommentService();

const adminCommentResolvers = {
  Query: {
    adminCommentsByApplicantRecordId: async (
      _parent: undefined,
      { applicantRecordId }: { applicantRecordId: string },
    ): Promise<AdminCommentDTO[]> => {
      return adminCommentService.getAdminCommentsByApplicantRecordId(
        applicantRecordId,
      );
    },
    adminCommentById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<AdminCommentDTO> => {
      return adminCommentService.getAdminCommentById(id);
    },
  },
  Mutation: {
    createAdminComment: async (
      _parent: undefined,
      { adminComment }: { adminComment: CreateAdminCommentDTO },
    ): Promise<AdminCommentDTO> => {
      return adminCommentService.createAdminComment(adminComment);
    },
    updateAdminComment: async (
      _parent: undefined,
      { id, adminComment }: { id: string; adminComment: UpdateAdminCommentDTO },
    ): Promise<AdminCommentDTO> => {
      return adminCommentService.updateAdminComment(id, adminComment);
    },
    deleteAdminCommentById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<AdminCommentDTO> => {
      return adminCommentService.deleteAdminCommentById(id);
    },
  },
};

export default adminCommentResolvers;
