import {
    SplitPanelLayout,
  } from "@/components/layouts/SplitPageLayout";
  import { PanelLayout } from "@/components/layouts/PanelLayout";
  import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
  import { InterviewHeader } from "@/pages/interview/_components/layout";
  import { RecruitmentPlatformThemeProvider } from "@/components/contexts/RecruitmentPlatformThemeProvider";
  import { ReactElement } from "react";
  import { NextPageWithLayout } from "../_app";
  import InterviewGroupIllustrationPanel from "./_components/InterviewGroupIllustrationPanel";
  
  const InterviewGroupsHomePage: NextPageWithLayout = () => {
    return (
      <PanelLayout borderLeft>
        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-poppins font-semibold text-[28px] leading-[1.4] text-[#252525]">
            Interview Groups
          </h1>
          <p className="font-source text-base text-black/75 leading-[1.4]">
            Select an interview group to open its scheduling page.
          </p>
        </div>
      </PanelLayout>
    );
  };
  
  InterviewGroupsHomePage.getLayout = (page: ReactElement) => (
    <RecruitmentPlatformThemeProvider>
      <ProtectedRoute allowedRoles={["Admin", "User"]}>
        <SplitPanelLayout header={<InterviewHeader steps={[]} />}>
          <InterviewGroupIllustrationPanel />
          {page}
        </SplitPanelLayout>
      </ProtectedRoute>
    </RecruitmentPlatformThemeProvider>
  );
  
  export default InterviewGroupsHomePage;
  