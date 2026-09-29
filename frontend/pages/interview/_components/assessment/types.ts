import type { InterviewNotesResult } from "@/graphql/typeUtils";

export type InterviewNotesState = {
  notes: InterviewNotesResult | null;
  isLoading: boolean;
  hasError: boolean;
  uploadNotes: (file: File) => void;
  uploadError: { message: string } | undefined;
  isUploading: boolean;
};
