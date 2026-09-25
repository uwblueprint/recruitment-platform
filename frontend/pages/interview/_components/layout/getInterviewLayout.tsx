import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { ReactElement } from "react";
import { InterviewFooter } from "./InterviewFooter";
import { InterviewHeader } from "./InterviewHeader";
import { InterviewLayout } from "./InterviewLayout";

export const getInterviewLayout =
  (
    header: ReactElement = <InterviewHeader steps={[]} />,
    footer: ReactElement | null = <InterviewFooter />,
  ) => {
  const InterviewPageLayout = (page: ReactElement) =>
    (
        <ProtectedRoute allowedRoles={["Admin", "User"]}>
          <InterviewLayout header={header} footer={footer ?? undefined}>
            {page}
          </InterviewLayout>
        </ProtectedRoute>
    );
  InterviewPageLayout.displayName = "InterviewPageLayout";
  return InterviewPageLayout;
};
