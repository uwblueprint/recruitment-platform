import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { PanelLayout } from "@/components/layouts/PanelLayout";
import { SplitPanelLayout } from "@/components/layouts/SplitPageLayout";
import { InterviewHeader } from "@/pages/interview/_components/layout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import InterviewGroupIllustrationPanel from "./_components/InterviewGroupIllustrationPanel";

const InterviewGroupsHomePage: NextPageWithLayout = () => {
  return (
    <PanelLayout borderLeft>
      <div className="flex w-full flex-col gap-4">
        <h1 className="font-poppins text-[28px] font-semibold leading-[1.4] text-semantic-text-primary">
          Interview Groups
        </h1>
        <p className="font-source text-base leading-[1.4] text-black/75">
          Select an interview group to open its scheduling page.
        </p>
      </div>
    </PanelLayout>
  );
};

InterviewGroupsHomePage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin", "User"]}>
    <SplitPanelLayout header={<InterviewHeader steps={[]} />}>
      <InterviewGroupIllustrationPanel />
      {page}
    </SplitPanelLayout>
  </ProtectedRoute>
);

export default InterviewGroupsHomePage;
