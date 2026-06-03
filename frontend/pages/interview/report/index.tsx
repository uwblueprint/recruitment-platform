import { useState } from "react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Typography } from "@mui/material";
import { InterviewConflict } from "@/graphql/typeUtils";
import {
  getInterviewLayout,
  InterviewHeader,
  InterviewFooter,
} from "../_components/layout";
import { NextPageWithLayout } from "../../_app";

const InterviewReportPage: NextPageWithLayout = () => {
  const [selectedConflict, setSelectedConflict] = useState<InterviewConflict | null>(null);
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white">
      <div className="flex h-full flex-col overflow-y-auto py-8 pl-9 pr-44">
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="font-poppins font-semibold text-neutral-800 mb-0">Please select the issue you'd like to report</h4>
          <Typography variant="body2" color="error">Note: Changes cannot be undone</Typography>
        </div>
        <FormControl fullWidth>
        <div className="border border-neutral-200 rounded-lg w-full px-7">
          <RadioGroup
          value={selectedConflict ?? ""}
          onChange={(e) => setSelectedConflict(e.target.value as InterviewConflict)}
          >
            <FormControlLabel 
              value={InterviewConflict.ApplicantConflict} 
              sx={{ gap: 2}}
              control={<Radio color="primary" />}
              label={
                <div className="py-5">
                  <p className="font-semibold mb-2">Conflict with Applicant </p>
                  <p className="text-sm text-neutral-500">Conflict of interest with the applicant</p>
                </div>
              }
            />
            <FormControlLabel
              value={InterviewConflict.ApplicantNoResponse}
              sx={{ gap: 2}}
              control={<Radio color="primary" />}
              label={
                <div className="py-5">
                  <p className="font-semibold mb-2">Haven't heard back from applicant</p>
                  <p className="text-sm text-neutral-500">Applicant has not replied to interview invite</p>
              </div>
              }
            />
            <FormControlLabel
              value={InterviewConflict.PartnerNoResponse}
              sx={{ gap: 2}}
              control={<Radio color="primary" />}
              label={
                <div className="py-5">
                  <p className="font-semibold mb-2">Haven't heard back from interview partner</p>
                  <p className="text-sm text-neutral-500">Interviewer partner has not responded to messages</p>
                </div>
              }
            />
            <FormControlLabel
              value={InterviewConflict.CannotAttend}
              sx={{ gap: 2}}
              control={<Radio color="primary" />}
              label={
                <div className="py-5">
                  <p className="font-semibold mb-2">Cannot make interview</p>
                  <p className="text-sm text-neutral-500">Description here</p>
                </div>
              }
            />
          </RadioGroup>
        </div>
      </FormControl>
      </div>
      </div>
    </div>
  );
};

// TODO: onContinue will trigger the submit issue action once wired up.
// After submission the footer disappears (see Figma — submitted state has no footer).
InterviewReportPage.getLayout = getInterviewLayout(
  <InterviewHeader steps={[]} />,
  <InterviewFooter onContinue={() => {}} continueLabel="Submit Issue" />,
);

export default InterviewReportPage;
