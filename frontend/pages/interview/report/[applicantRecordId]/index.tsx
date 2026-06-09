import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Typography } from "@mui/material";
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
import { IssueSubmitted } from "../_components";

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
  const radioColor = "#2E3A59";

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
        selectedConflict,
      );
      setReportDialogOpen(false);
      setReportIssueSubmitted(true);
      setReportError(false);
    } catch (err) {
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
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="font-poppins font-semibold text-neutral-800 mb-0">
              Please select the issue you&apos;d like to report
            </h4>
            <Typography
              className="!font-source"
              variant="body2"
              sx={{ color: "#E55F5F" }}
            >
              Note: Changes cannot be undone
            </Typography>
          </div>
          <FormControl fullWidth>
            <div className="border border-neutral-200 rounded-lg w-full px-7">
              <RadioGroup
                value={selectedConflict ?? ""}
                onChange={(e) =>
                  setSelectedConflict(e.target.value as InterviewConflict)
                }
              >
                <FormControlLabel
                  value={InterviewConflict.ApplicantConflict}
                  sx={{ gap: 2 }}
                  control={
                    <Radio
                      sx={{
                        color: radioColor,
                        "&.Mui-checked": { color: radioColor },
                      }}
                    />
                  }
                  label={
                    <div className="py-5">
                      <p className="font-poppins font-semibold mb-2">
                        Conflict with Applicant
                      </p>
                      <p className="text-sm font-source">
                        Conflict of interest with the applicant
                      </p>
                    </div>
                  }
                />
                <FormControlLabel
                  value={InterviewConflict.ApplicantNoResponse}
                  sx={{ gap: 2 }}
                  control={
                    <Radio
                      sx={{
                        color: radioColor,
                        "&.Mui-checked": { color: radioColor },
                      }}
                    />
                  }
                  label={
                    <div className="py-5">
                      <p className="font-poppins font-semibold mb-2">
                        Haven&apos;t heard back from applicant
                      </p>
                      <p className="text-sm font-source">
                        Applicant has not replied to interview invite
                      </p>
                    </div>
                  }
                />
                <FormControlLabel
                  value={InterviewConflict.PartnerNoResponse}
                  sx={{ gap: 2 }}
                  control={
                    <Radio
                      sx={{
                        color: radioColor,
                        "&.Mui-checked": { color: radioColor },
                      }}
                    />
                  }
                  label={
                    <div className="py-5">
                      <p className="font-poppins font-semibold mb-2">
                        Haven&apos;t heard back from interview partner
                      </p>
                      <p className="text-sm font-source">
                        Interviewer partner has not responded to messages
                      </p>
                    </div>
                  }
                />
                <FormControlLabel
                  value={InterviewConflict.CannotAttend}
                  sx={{ gap: 2 }}
                  control={
                    <Radio
                      sx={{
                        color: radioColor,
                        "&.Mui-checked": { color: radioColor },
                      }}
                    />
                  }
                  label={
                    <div className="py-5">
                      <p className="font-poppins font-semibold mb-2">
                        Cannot make interview
                      </p>
                      <p className="text-sm font-source">Description here</p>
                    </div>
                  }
                />
              </RadioGroup>
            </div>
          </FormControl>
        </div>
      </div>

      <Dialogue
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        header="Report issue?"
        text={`${
          !selectedConflict
            ? "Please select an issue before submitting."
            : reportError
            ? "Something went wrong. Please try again."
            : "Clicking yes will notify admins and cannot be undone."
        }`}
      >
        <div className="flex gap-4 w-full">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setReportDialogOpen(false)}
            className="flex-1 min-w-0 flex justify-center items-center whitespace-nowrap !m-0"
            disabled={loading}
          >
            <span className="text-[16px] font-normal font-source">Cancel</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirmReport}
            className="flex-1 min-w-0 flex justify-center items-center whitespace-nowrap !m-0"
            disabled={loading || !selectedConflict}
          >
            <span className="text-[16px] font-normal font-source">
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
  <ReportIssueFooter />,
);

export default InterviewReportPage;
