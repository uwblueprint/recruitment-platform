import { ReactElement } from "react";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { RecruitmentPlatformThemeProvider } from "@/components/contexts/RecruitmentPlatformThemeProvider";
import { InterviewLayout } from "./InterviewLayout";
import { InterviewHeader } from "./InterviewHeader";
import { InterviewFooter } from "./InterviewFooter";

export const getInterviewLayout =
  (
    header: ReactElement = <InterviewHeader steps={[]} />,
    footer: ReactElement | null = <InterviewFooter />,
  ) => {
  const InterviewPageLayout = (page: ReactElement) =>
    (
      <RecruitmentPlatformThemeProvider>
        <ProtectedRoute allowedRoles={["Admin", "User"]}>
          {/* TODO: replace hardcoded candidateName with real data once API wiring is in scope */}
          <InterviewLayout
            candidateName="Percy Jackson"
            header={header}
            footer={footer ?? undefined}
          >
            {page}
          </InterviewLayout>
        </ProtectedRoute>
      </RecruitmentPlatformThemeProvider>
    );
  InterviewPageLayout.displayName = "InterviewPageLayout";
  return InterviewPageLayout;
};
