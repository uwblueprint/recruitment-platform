import { ProtectedInterviewRoute } from "@/components/contexts/ProtectedInterviewRoute";
import { ReactElement } from "react";
import { InterviewFooter } from "./InterviewFooter";
import { InterviewHeader } from "./InterviewHeader";
import { InterviewLayout } from "./InterviewLayout";

export const getInterviewLayout = (
  header: ReactElement = <InterviewHeader steps={[]} />,
  footer: ReactElement | null = <InterviewFooter />,
  wrapLayout: (layout: ReactElement) => ReactElement = (layout) => layout,
) => {
  const InterviewPageLayout = (page: ReactElement) => (
    <ProtectedInterviewRoute>
      {wrapLayout(
        <InterviewLayout header={header} footer={footer ?? undefined}>
          {page}
        </InterviewLayout>
      )}
    </ProtectedInterviewRoute>
  );
  InterviewPageLayout.displayName = "InterviewPageLayout";
  return InterviewPageLayout;
};
