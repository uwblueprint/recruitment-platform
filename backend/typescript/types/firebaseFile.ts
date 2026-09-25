export type FirebaseFileDTO = {
  id: string;
  storagePath: string;
  originalFileName: string;
  uploadedUserId: number;
  sizeBytes: number;
};

export type CreateFirebaseFileDTO = {
  originalFileName: string;
  uploadedUserId: number;
  sizeBytes: number;
  localFilePath: string;
  contentType: string;
};

export type InterviewNotesDTO = {
  fileId: string;
  fileName: string;
  signedUrl: string;
};
