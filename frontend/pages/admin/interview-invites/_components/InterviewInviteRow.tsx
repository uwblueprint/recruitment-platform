import { InterviewInvite } from "./types";
import { theme } from "@/styles/Theme";
import { CollapsibleRow } from "@/components/common/CollapsibleRow";
import { Chip, Avatar } from "@mui/material";

const STATUS_LABELS: Record<string, string> = {
  AVAILABILITY_PENDING: "Availability pending",
  READY_TO_INTERVIEW: "Ready for invite",
  INVITES_SENT: "Invites sent",
};

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
  const { interviewers, interviewees, interviewType, calendlyLink, status } =
    invite;

  const interviewerLabel =
    interviewers.length === 1
      ? interviewers[0]
      : `${interviewers[0]} + ${interviewers[1]}`;

  const statusLabel = STATUS_LABELS[status] ?? status;

  return (
    <CollapsibleRow
      title={{
        text: interviewerLabel,
        supportingText: interviewType,
        leftSlot: (
          <span className="flex items-center">
            <Avatar
              sx={{
                width: 42,
                height: 42,
                mr: "-10px",
                zIndex: 1,
                bgcolor: "#C4C4C4",
                fontSize: 16,
              }}
            >
              {interviewers[0]?.[0]?.toUpperCase()}
            </Avatar>
            {interviewers.length > 1 && (
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "#9f9f9f",
                  fontSize: 16,
                }}
              >
                {interviewers[1]?.[0]?.toUpperCase()}
              </Avatar>
            )}
          </span>
        ),
      }}
      subtitles={[
        {
          text: `${interviewees.length} Interviewee${
            interviewees.length !== 1 ? "s" : ""
          }`,
        },
        {
          text: "Status:",
          rightSlot: (
            <Chip
              label={statusLabel}
              size="small"
              className="font-source !rounded-[4px] !py-4"
              sx={{ backgroundColor: theme.colors.V05 }}
            />
          ),
        },
      ]}
      selection={{
        checked: isSelected,
        onChange: onSelect,
        label: `Select ${interviewerLabel}`,
      }}
      toggleLabel={`Interview details for ${interviewerLabel}`}
    >
      <div className="grid grid-cols-[0.8fr_1.6fr_1.6fr]">
        {/* Column 1: Interviewer availability */}
        <div className="flex flex-col items-start gap-3 self-stretch px-6 py-4 border-r border-neutral-200">
          <p className="font-source font-semibold text-base text-neutral-800">
            Interviewer availability:
          </p>
          {calendlyLink ? (
            <a
              href={calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-source text-sm text-link underline break-all"
            >
              {calendlyLink}
            </a>
          ) : (
            <span className="font-source text-sm text-neutral-500 italic">
              No link provided
            </span>
          )}
        </div>

        {/* Column 2: Interviewees */}
        <div className="flex flex-col">
          <p className="font-source font-semibold text-base text-neutral-800 px-6 py-4">
            Interviewees:
          </p>
          {interviewees.map((interviewee, idx) => (
            <p
              key={idx}
              className={`font-source text-base text-neutral-800 px-6 py-4 h-14 flex items-center ${
                idx % 2 === 0 ? "bg-charcoal-100" : "bg-white"
              }`}
            >
              {interviewee.name}
            </p>
          ))}
        </div>

        {/* Column 3: Role interviewing for */}
        <div className="flex flex-col">
          <p className="font-source font-semibold text-base text-neutral-800 px-6 py-4">
            Role interviewing for:
          </p>
          {interviewees.map((interviewee, idx) => (
            <p
              key={idx}
              className={`font-source text-base text-neutral-800 px-6 py-4 h-14 flex items-center ${
                idx % 2 === 0 ? "bg-charcoal-100" : "bg-white"
              }`}
            >
              {interviewee.role}
            </p>
          ))}
        </div>
      </div>
    </CollapsibleRow>
  );
};
