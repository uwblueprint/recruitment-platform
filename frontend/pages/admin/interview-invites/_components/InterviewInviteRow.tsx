import { useState } from "react";
import { InterviewInvite } from "./types";
import { theme } from "@/styles/Theme";
import { ArrowDownIcon } from "@/components/icons/arrow-down.icon";
import { ArrowUpIcon } from "@/components/icons/arrow-up.icon";
import { Checkbox, Divider, Collapse, Chip } from "@mui/material";

type InterviewInviteRowProps = {
  invite: InterviewInvite;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
};
export const InterviewInviteRow = ({
  invite,
  isSelected,
  onSelect,
}: InterviewInviteRowProps) => {
  const [open, setOpen] = useState(false);

  const { interviewers, interviewees, interviewType, calendlyLink, status } =
    invite;

  const interviewerLabel =
    interviewers.length === 1
      ? interviewers[0]
      : `${interviewers[0]} + ${interviewers[1]}`;

  const dividerSx = {
    borderRightWidth: 2,
    height: 24,
  };

  return (
    <div className="w-full">
      <div
        className="flex justify-between items-center w-full px-6 py-3 pl-3 cursor-pointer select-none border-[1px] border-neutral-200 rounded-t-[4px]"
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* Left Side */}
        <div className="flex flex-row gap-6 items-center">
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              padding: 0,
              width: 20,
              height: 20,
              color: theme.colors.greys.checkbox_border,
              "&.Mui-checked": { color: theme.colors.B15 },
            }}
          />

          {/* Interview Info */}
          <div>
            <p className="font-poppins font-medium text-base text-neutral-800 leading-[1.4]">
              {interviewerLabel}
            </p>
            <p className="font-source text-sm text-neutral-800 leading-[1.4]">
              {interviewType}
            </p>
          </div>

          <Divider
            orientation="vertical"
            className="!h-6 !self-center !border-r-2 !bg-neutral-200"
            flexItem
            sx={dividerSx}
          />
          {/* Interviewee Count */}
          <span className="font-source text-sm text-neutral-800 whitespace-nowrap">
            {interviewees.length} Interviewee
            {interviewees.length !== 1 ? "s" : ""}
          </span>

          <Divider
            orientation="vertical"
            className="!h-6 !self-center !border-r-2 !bg-neutral-200"
            flexItem
            sx={dividerSx}
          />
          {/* Review Status */}
          <div className="flex items-center gap-3">
            <span className="font-source text-sm text-neutral-800 whitespace-nowrap">
              Status:
            </span>
            <Chip
              label={status}
              size="small"
              className="font-source !rounded-[4px] !py-4 !bg-purple-200"
              sx={{
                backgroundColor: `${theme.colors.V05}`,
              }}
            />
          </div>
        </div>

        {/* Right Side */}
        {open ? (
          <ArrowUpIcon className="text-neutral-800" />
        ) : (
          <ArrowDownIcon className="text-neutral-800" />
        )}
      </div>

      <Collapse in={open}>
        <div className="border-b border-l border-r border-neutral-200">
          <div className="grid grid-cols-[0.8fr_1.6fr_1.6fr]">
            {/* Column 1: Interviewer availability */}
            <div className="flex flex-col items-start gap-3 self-stretch px-6 py-4 border-r border-neutral-200">
              <p className="font-source font-semibold text-sm text-neutral-800">
                Interviewer availability:
              </p>
              <a
                href={calendlyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-source text-sm text-link underline break-all"
                onClick={(e) => e.stopPropagation()}
              >
                {calendlyLink}
              </a>
            </div>

            {/* Column 2: Interviewees */}
            <div className="flex flex-col">
              <p className="font-source font-semibold text-sm text-neutral-800 px-5 py-3">
                Interviewees:
              </p>
              {interviewees.map((interviewee, idx) => (
                <p
                  key={idx}
                  className={`font-source text-sm text-neutral-800 px-5 py-3 ${
                    idx % 2 === 0 ? "bg-charcoal-100" : "bg-white"
                  }`}
                >
                  {interviewee.name}
                </p>
              ))}
            </div>

            {/* Column 3: Role interviewing for */}
            <div className="flex flex-col">
              <p className="font-source font-semibold text-sm text-neutral-800 px-5 py-3">
                Role interviewing for:
              </p>
              {interviewees.map((interviewee, idx) => (
                <p
                  key={idx}
                  className={`font-source text-sm text-neutral-800 px-5 py-3 ${
                    idx % 2 === 0 ? "bg-charcoal-100" : "bg-white"
                  }`}
                >
                  {interviewee.role}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};
