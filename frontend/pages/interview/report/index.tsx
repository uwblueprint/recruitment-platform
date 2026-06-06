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
} from "../_components/layout";
import { NextPageWithLayout } from "../../_app";
import { Dialogue } from "@/components/common/Dialogue";
import { Button } from "@/components/common/Button";
import { useInterviewProgress } from "../_components/InterviewProgressContext";

const ReportIssueFooter = () => {
  const { setReportDialogOpen } = useInterviewProgress();
  return (
    <InterviewFooter
      onContinue={() => setReportDialogOpen(true)}
      continueLabel="Submit Issue"
    />
  );
};

const InterviewReportPage: NextPageWithLayout = () => {
  const [selectedConflict, setSelectedConflict] =
    useState<InterviewConflict | null>(null);
  const { reportDialogOpen, setReportDialogOpen } = useInterviewProgress();
  const radioColor = "#2E3A59";

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      <div className="flex h-full flex-col overflow-y-auto py-8 pl-9 pr-44">
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="font-poppins font-semibold text-neutral-800 mb-0">
              Please select the issue you'd like to report
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
                        "&.Mui-checked": {
                          color: radioColor,
                        },
                      }}
                    />
                  }
                  label={
                    <div className="py-5">
                      <p className="font-poppins font-semibold mb-2">
                        Conflict with Applicant{" "}
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
                        "&.Mui-checked": {
                          color: radioColor,
                        },
                      }}
                    />
                  }
                  label={
                    <div className="py-5">
                      <p className="font-poppins font-semibold mb-2">
                        Haven't heard back from applicant
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
                        "&.Mui-checked": {
                          color: radioColor,
                        },
                      }}
                    />
                  }
                  label={
                    <div className="py-5">
                      <p className="font-poppins font-semibold mb-2">
                        Haven't heard back from interview partner
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
                        "&.Mui-checked": {
                          color: radioColor,
                        },
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
        text="Clicking yes will notify admins and cannot be undone."
      >
        <div className="flex gap-4 w-full">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setReportDialogOpen(false)}
            className="flex-1 min-w-0 flex justify-center items-center whitespace-nowrap !m-0"
          >
            <span className="text-[16px] font-normal font-source">Cancel</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              // TODO: call reportInterviewConflict mutation once IDs are wired up
              setReportDialogOpen(false);
            }}
            className="flex-1 min-w-0 flex justify-center items-center whitespace-nowrap !m-0"
          >
            <span className="text-[16px] font-normal font-source">
              Yes, report
            </span>
          </Button>
        </div>
      </Dialogue>
    </div>
  );
};

// TODO: After submission the footer disappears (see Figma — submitted state has no footer).
InterviewReportPage.getLayout = getInterviewLayout(
  <InterviewHeader steps={[]} />,
  <ReportIssueFooter />,
);

export default InterviewReportPage;
