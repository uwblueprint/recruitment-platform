export type AdminCommentDTO = {
  id: string;
  userId: number;
  applicantRecordId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAdminCommentDTO = Omit<
  AdminCommentDTO,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateAdminCommentDTO = Pick<AdminCommentDTO, "comment">;
