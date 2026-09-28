import { client } from "@/client";
import {
  AdminCommentsByApplicantRecordIdDocument,
  CreateAdminCommentDocument,
  UpdateAdminCommentDocument,
  DeleteAdminCommentByIdDocument,
  type AdminCommentResult,
  type AdminCommentsByApplicantRecordIdQuery,
  type AdminCommentsByApplicantRecordIdQueryVariables,
  type CreateAdminCommentMutation,
  type CreateAdminCommentMutationVariables,
  type UpdateAdminCommentMutation,
  type UpdateAdminCommentMutationVariables,
  type DeleteAdminCommentByIdMutation,
  type DeleteAdminCommentByIdMutationVariables,
} from "@/graphql/typeUtils";

import BaseAPIClient from "./BaseAPIClient";

class AdminCommentAPIClient {
  static async getByApplicantRecordId(
    applicantRecordId: string,
  ): Promise<AdminCommentResult[]> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.query<
        AdminCommentsByApplicantRecordIdQuery,
        AdminCommentsByApplicantRecordIdQueryVariables
      >({
        query: AdminCommentsByApplicantRecordIdDocument,
        variables: { applicantRecordId },
        fetchPolicy: "network-only",
      });

      if (!data?.adminCommentsByApplicantRecordId) {
        throw new Error("No data returned");
      }

      return data.adminCommentsByApplicantRecordId;
    } catch {
      throw new Error("Failed to get admin comments");
    }
  }

  static async create(
    userId: string,
    applicantRecordId: string,
    comment: string,
  ): Promise<AdminCommentResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        CreateAdminCommentMutation,
        CreateAdminCommentMutationVariables
      >({
        mutation: CreateAdminCommentDocument,
        variables: {
          adminComment: { userId, applicantRecordId, comment },
        },
      });

      if (!data?.createAdminComment) {
        throw new Error("No data returned");
      }

      return data.createAdminComment;
    } catch {
      throw new Error("Failed to create admin comment");
    }
  }

  static async update(
    id: string,
    comment: string,
  ): Promise<AdminCommentResult> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        UpdateAdminCommentMutation,
        UpdateAdminCommentMutationVariables
      >({
        mutation: UpdateAdminCommentDocument,
        variables: { id, adminComment: { comment } },
      });

      if (!data?.updateAdminComment) {
        throw new Error("No data returned");
      }

      return data.updateAdminComment;
    } catch {
      throw new Error("Failed to update admin comment");
    }
  }

  static async delete(id: string): Promise<string> {
    await BaseAPIClient.handleAuthRefresh();

    try {
      const { data } = await client.mutate<
        DeleteAdminCommentByIdMutation,
        DeleteAdminCommentByIdMutationVariables
      >({
        mutation: DeleteAdminCommentByIdDocument,
        variables: { id },
      });

      if (!data?.deleteAdminCommentById) {
        throw new Error("No data returned");
      }

      return data.deleteAdminCommentById.id;
    } catch {
      throw new Error("Failed to delete admin comment");
    }
  }
}

export default AdminCommentAPIClient;
