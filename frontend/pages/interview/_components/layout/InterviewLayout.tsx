import { ReactNode } from "react";
import {
  SPLIT_PANEL_WIDTHS,
  SplitPanelLayout,
} from "@/components/layouts/SplitPageLayout";

import { InterviewNavPanel } from "../nav";
import { InterviewProgressProvider } from "../InterviewProgressContext";
import { InterviewHeader } from "./InterviewHeader";
import { InterviewFooter } from "./InterviewFooter";
import { PanelLayout } from "@/components/layouts/PanelLayout";

interface InterviewLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export const InterviewLayout = ({
  header = <InterviewHeader />,
  footer = <InterviewFooter />,
  children,
}: InterviewLayoutProps) => {
  return (
    <InterviewProgressProvider>
      <SplitPanelLayout
        header={header}
        footer={footer}
        leftWidth={SPLIT_PANEL_WIDTHS.interview.left}
      >
        <PanelLayout
          borderRight
          fillContent
          contentClassName="flex min-h-full flex-col overflow-y-auto pt-[50px] pb-8"
        >
          <InterviewNavPanel />
        </PanelLayout>
        {children}
      </SplitPanelLayout>
    </InterviewProgressProvider>
  );
};
