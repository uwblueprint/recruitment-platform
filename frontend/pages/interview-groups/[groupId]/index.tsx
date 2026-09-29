import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { PanelLayout } from "@/components/layouts/PanelLayout";
import {
  SPLIT_PANEL_WIDTHS,
  SplitPanelLayout,
} from "@/components/layouts/SplitPageLayout";
import { InterviewHeader } from "@/pages/interview/_components/layout";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import useInterviewGroupDetails from "../_components/hooks/useInterviewGroupDetails";
import useSchedulingLinkEditor from "../_components/hooks/useSchedulingLinkEditor";
import { NextPageWithLayout } from "../../_app";
import CalendlyLinkForm from "../_components/CalendlyLinkForm";
import CalendlyLinkSubmitted from "../_components/CalendlyLinkSubmitted";
import CalendlySection from "../_components/CalendlySection";
import InterviewGroupIllustrationPanel from "../_components/InterviewGroupIllustrationPanel";
import InterviewPageHeader from "../_components/InterviewPageHeader";
import PartnerSection from "../_components/PartnerSection";

const InterviewGroupContent = ({
  interviewGroupId,
}: {
  interviewGroupId: string;
}) => {
  const currentUser = useAuthenticatedUser();
  const { group, partner, applicantNames, isLoading, error } =
    useInterviewGroupDetails(interviewGroupId, currentUser?.id);
  const {
    linkInput,
    setLinkDraft,
    isEditing,
    startEditing,
    isSubmitted,
    submitLink,
    isSaving,
    saveError,
    canSave,
  } = useSchedulingLinkEditor(group);

  return (
    <PanelLayout borderLeft>
      <div className="flex flex-col gap-9 w-full">
        <InterviewPageHeader />

        <div className="flex flex-col gap-12 w-full">
          {isLoading && (
            <div className="border border-neutral-200 rounded-lg px-4 py-3 bg-surface-info">
              <p className="font-source text-sm text-link leading-[1.4]">
                Loading interview group details...
              </p>
            </div>
          )}
          {error && (
            <div className="border border-alert-errorBorder rounded-lg px-4 py-3 bg-red-50">
              <p className="font-source text-sm text-alert-errorText leading-[1.4]">
                Could not load all interview details. Please refresh and try
                again.
              </p>
            </div>
          )}

          <PartnerSection
            partner={
              partner
                ? {
                    firstName: partner.firstName,
                    lastName: partner.lastName,
                    email: partner.email,
                  }
                : null
            }
            applicantNames={applicantNames}
          />

          <CalendlySection />
          {saveError && (
            <p
              role="alert"
              className="font-source text-sm text-alert-errorText"
            >
              Failed to save scheduling link. Please try again.
            </p>
          )}

          {isSubmitted ? (
            <CalendlyLinkSubmitted
              linkInput={linkInput}
              onLinkChange={setLinkDraft}
              isEditing={isEditing}
              onEdit={startEditing}
              onResubmit={submitLink}
              disabled={!canSave || isSaving}
            />
          ) : (
            <CalendlyLinkForm
              linkInput={linkInput}
              onLinkChange={setLinkDraft}
              onSubmit={submitLink}
              disabled={!canSave || isSaving}
            />
          )}
        </div>
      </div>
    </PanelLayout>
  );
};

const InterviewGroupPage: NextPageWithLayout = () => {
  const router = useRouter();
  const rawInterviewGroupId = router.query.groupId;
  const interviewGroupId =
    typeof rawInterviewGroupId === "string" ? rawInterviewGroupId : null;

  if (!router.isReady || !interviewGroupId) {
    return null;
  }

  return (
    <InterviewGroupContent
      key={interviewGroupId}
      interviewGroupId={interviewGroupId}
    />
  );
};

InterviewGroupPage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin", "User"]}>
    <SplitPanelLayout
      leftWidth={SPLIT_PANEL_WIDTHS.interview.left}
      header={<InterviewHeader steps={[]} />}
    >
      <InterviewGroupIllustrationPanel />
      {page}
    </SplitPanelLayout>
  </ProtectedRoute>
);

export default InterviewGroupPage;
