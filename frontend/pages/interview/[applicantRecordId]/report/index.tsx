import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { InterviewConflict } from "@/graphql/typeUtils";
import {
  getInterviewLayout,
  InterviewHeader,
  InterviewFooter,
} from "../../_components/layout";
import { NextPageWithLayout } from "../../../_app";
import { Dialogue } from "@/components/common/Dialogue";
import { Button } from "@/components/common/Button";
import { useInterviewProgress } from "../../_components/InterviewProgressContext";
import { useRouter } from "next/router";
import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import InterviewPageAPIClient from "@/APIClients/InterviewPageAPIClient";
import { IssueSubmitted } from "./_components";
import { theme } from "@/styles/Theme";

type RadioOption = {
  value: InterviewConflict;
  title: string;
  description: string;
};

const CONFLICT_OPTIONS: RadioOption[] = [
  {
    value: InterviewConflict.ApplicantConflict,
    title: "Conflict with applicant",
    description: "Conflict of interest with the applicant",
  },
  {
    value: InterviewConflict.ApplicantNoResponse,
    title: "Haven't heard back from applicant",
    description: "Applicant has not replied to interview invite",
  },
  {
    value: InterviewConflict.PartnerNoResponse,
    title: "Haven't heard back from interview partner",
    description: "Interviewer partner has not responded to messages",
  },
  {
    value: InterviewConflict.CannotAttend,
    title: "Cannot make Interview",
    description: "Description here",
  },
];

const ReportIssueFooter = () => {
  const { setReportDialogOpen, reportIssueSubmitted } = useInterviewProgress();
  if (reportIssueSubmitted) return null;
  return (
    <InterviewFooter
      onContinue={() => setReportDialogOpen(true)}
      continueLabel="Submit Issue"
    />
  );
};

const InterviewReportPage: NextPageWithLayout = () => {
  const router = useRouter();
  const authenticatedUser = useAuthenticatedUser();
  const [selectedConflict, setSelectedConflict] =
    useState<InterviewConflict | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportError, setReportError] = useState(false);
  const {
    reportDialogOpen,
    setReportDialogOpen,
    reportIssueSubmitted,
    setReportIssueSubmitted,
  } = useInterviewProgress();

  const interviewedApplicantRecordId = router.isReady
    ? (router.query.applicantRecordId as string)
    : null;

  if (!router.isReady) return null;

  const handleConfirmReport = async () => {
    if (
      !selectedConflict ||
      !interviewedApplicantRecordId ||
      !authenticatedUser
    )
      return;
    setLoading(true);
    try {
      await InterviewPageAPIClient.reportInterviewConflict(
        interviewedApplicantRecordId,
        authenticatedUser.id,
        selectedConflict
      );
      setReportDialogOpen(false);
      setReportIssueSubmitted(true);
      setReportError(false);
    } catch {
      setReportError(true);
    } finally {
      setLoading(false);
    }
  };

  if (reportIssueSubmitted) {
    return <IssueSubmitted />;
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      <div className="flex h-full flex-col overflow-y-auto py-8 pl-9 pr-44">
        <div className="flex flex-col gap-9">
          <div>
            <h4 className="mb-0 font-poppins text-[24px] font-medium leading-[1.4] text-black">
              Please select the issue you&apos;d like to report
            </h4>
            <Typography
              className="!font-source"
              variant="body1"
              sx={{ color: theme.colors.R20 }}
            >
              Note: Changes cannot be undone
            </Typography>
          </div>
          <FormControl fullWidth>
            <div className="flex flex-col items-start self-stretch rounded-lg border border-neutral-200 p-6">
              <RadioGroup
                value={selectedConflict ?? ""}
                onChange={(e) =>
                  setSelectedConflict(e.target.value as InterviewConflict)
                }
                sx={{ gap: "48px" }}
              >
                {CONFLICT_OPTIONS.map(({ value, title, description }) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    sx={{ gap: "18px", alignItems: "center" }}
                    control={<Radio className="!text-icon" />}
                    label={
                      <div className="flex flex-col gap-2 leading-[1.4]">
                        <p className="font-poppins text-[16px] font-medium text-black">
                          {title}
                        </p>
                        <p className="font-source text-[16px] text-black">
                          {description}
                        </p>
                      </div>
                    }
                  />
                ))}
              </RadioGroup>
            </div>
          </FormControl>
        </div>
      </div>

      <Dialogue
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        header="Report issue?"
        text={
          !selectedConflict
            ? "Please select an issue before submitting."
            : "Clicking yes will notify admins and cannot be undone."
        }
        errorText={
          reportError ? "Something went wrong. Please try again." : undefined
        }
      >
        <div className="flex w-full gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setReportDialogOpen(false)}
            className="flex-1 min-w-0 flex justify-center items-center whitespace-nowrap !m-0"
            disabled={loading}
          >
            <span className="font-source text-[16px] font-normal">Cancel</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirmReport}
            className="flex-1 min-w-0 flex justify-center items-center whitespace-nowrap !m-0"
            disabled={loading || !selectedConflict}
          >
            <span className="font-source text-[16px] font-normal">
              {loading ? "Submitting..." : "Yes, report"}
            </span>
          </Button>
        </div>
      </Dialogue>
    </div>
  );
};

InterviewReportPage.getLayout = getInterviewLayout(
  <InterviewHeader steps={[]} />,
  <ReportIssueFooter />
);

export default InterviewReportPage;
