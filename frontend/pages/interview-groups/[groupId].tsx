import InterviewGroupAPIClient from "@/APIClients/InterviewGroupAPIClient";
import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { PanelLayout } from "@/components/layouts/PanelLayout";
import {
  SPLIT_PANEL_WIDTHS,
  SplitPanelLayout,
} from "@/components/layouts/SplitPageLayout";
import useInterviewGroupData from "@/hooks/useInterviewGroupData";
import { InterviewHeader } from "@/pages/interview/_components/layout";
import type { InterviewGroupStatus } from "@/types";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../_app";
import CalendlyLinkForm from "./_components/CalendlyLinkForm";
import CalendlyLinkSubmitted from "./_components/CalendlyLinkSubmitted";
import CalendlySection from "./_components/CalendlySection";
import InterviewGroupIllustrationPanel from "./_components/InterviewGroupIllustrationPanel";
import InterviewPageHeader from "./_components/InterviewPageHeader";
import PartnerSection from "./_components/PartnerSection";

const InterviewGroupContent = ({
  interviewGroupId,
}: {
  interviewGroupId: string;
}) => {
  const currentUser = useAuthenticatedUser();
  const [linkDraft, setLinkDraft] = useState<string | null>(null);
  const [statusOverride, setStatusOverride] =
    useState<InterviewGroupStatus | null>(null);
  const [isSubmittedOverride, setIsSubmittedOverride] = useState<
    boolean | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);

  const { group, interviewedApplicants, interviewers, isLoading, error } =
    useInterviewGroupData(interviewGroupId, Number(currentUser?.id ?? null));

  const partner = interviewers.find((i) => i.id !== currentUser?.id) ?? null;

  const applicantNames = interviewedApplicants
    .map((a) => `${a.applicantFirstName} ${a.applicantLastName}`)
    .join(", ");

  const linkInput = linkDraft ?? group?.schedulingLink ?? "";
  const interviewGroupStatus = statusOverride ?? group?.status ?? null;
  const isSubmitted = isSubmittedOverride ?? Boolean(group?.schedulingLink);

  const updateSchedulingLink = async (
    nextLink: string,
    afterUpdate: () => void,
  ) => {
    if (!interviewGroupId || !interviewGroupStatus) {
      return;
    }

    const updatedGroup = await InterviewGroupAPIClient.updateInterviewGroup(
      interviewGroupId,
      {
        schedulingLink: nextLink,
        status: interviewGroupStatus,
      },
    );

    setLinkDraft(updatedGroup.schedulingLink ?? null);
    setStatusOverride(updatedGroup.status);
    setIsSubmittedOverride(Boolean(updatedGroup.schedulingLink));
    afterUpdate();
  };

  return (
    <PanelLayout borderLeft>
      <div className="flex w-full flex-col gap-9">
        <InterviewPageHeader />

        <div className="flex w-full flex-col gap-12">
          {isLoading ? (
            <div className="rounded-lg border border-semantic-border-light bg-semantic-bg-info px-4 py-3">
              <p className="font-source text-sm leading-[1.4] text-semantic-text-link">
                Loading interview group details...
              </p>
            </div>
          ) : null}
          {error ? (
            <div className="rounded-lg border border-semantic-border-danger bg-semantic-bg-danger px-4 py-3">
              <p className="font-source text-sm leading-[1.4] text-semantic-text-danger">
                Could not load all interview details. Please refresh and try
                again.
              </p>
            </div>
          ) : null}

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

          {isSubmitted ? (
            <CalendlyLinkSubmitted
              linkInput={linkInput}
              onLinkChange={setLinkDraft}
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onResubmit={() => {
                void updateSchedulingLink(linkInput, () => {
                  setIsEditing(false);
                });
              }}
            />
          ) : (
            <CalendlyLinkForm
              linkInput={linkInput}
              onLinkChange={setLinkDraft}
              onSubmit={() => {
                void updateSchedulingLink(linkInput, () => {
                  setIsSubmittedOverride(true);
                });
              }}
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
