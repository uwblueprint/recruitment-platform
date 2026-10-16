import type { InterviewInviteResult } from "@/graphql/typeUtils";
import { theme } from "@/styles/Theme";
import { CollapsibleRow } from "@/components/common/CollapsibleRow";
import { Chip, Avatar } from "@mui/material";

const STATUS_LABELS: Record<string, string> = {
  AVAILABILITY_PENDING: "Availability pending",
  READY_TO_INTERVIEW: "Ready for invite",
  INVITES_SENT: "Invites sent",
};

type InterviewInviteRowProps = {
  invite: InterviewInviteResult;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
};

export const InterviewInviteRow = ({
  invite,
  isSelected,
  onSelect,
}: InterviewInviteRowProps) => {
  const { interviewers, interviewees, position, schedulingLink, status } =
    invite;

  const interviewerLabel =
    interviewers
      .map(({ firstName, lastName }) => `${firstName} ${lastName}`)
      .join(" + ") || "No interviewers";

  const statusLabel = STATUS_LABELS[status] ?? status;

  return (
    <CollapsibleRow
      title={{
        text: interviewerLabel,
        supportingText: `${position} interviewers`,
        leftSlot: <InterviewerAvatars interviewers={interviewers} />,
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
      <CollapsibleContent
        schedulingLink={schedulingLink}
        interviewees={interviewees}
      />
    </CollapsibleRow>
  );
};

const CollapsibleContent = ({
  schedulingLink,
  interviewees,
}: Pick<InterviewInviteResult, "schedulingLink" | "interviewees">) => (
  <div className="grid grid-cols-[0.8fr_1.6fr_1.6fr]">
    <InterviewAvailability schedulingLink={schedulingLink} />
    <InterviewDetails interviewees={interviewees} />
  </div>
);

const InterviewAvailability = ({
  schedulingLink,
}: Pick<InterviewInviteResult, "schedulingLink">) => (
  <div className="flex flex-col items-start gap-3 self-stretch px-6 py-4 border-r border-neutral-200">
    <p className="font-source font-semibold text-base text-neutral-800">
      Interviewer availability:
    </p>
    {schedulingLink ? (
      <a
        href={schedulingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="font-source text-sm text-link underline break-all"
      >
        {schedulingLink}
      </a>
    ) : (
      <span className="font-source text-sm text-neutral-500 italic">
        No link provided
      </span>
    )}
  </div>
);

const InterviewDetails = ({
  interviewees,
}: {
  interviewees: InterviewInviteResult["interviewees"];
}) => (
  <>
    <InterviewDetailColumn
      heading="Interviewees:"
      values={interviewees.map(
        ({ firstName, lastName }) => `${firstName} ${lastName}`
      )}
    />
    <InterviewDetailColumn
      heading="Role interviewing for:"
      values={interviewees.map(({ position }) => position)}
    />
  </>
);

const InterviewDetailColumn = ({
  heading,
  values,
}: {
  heading: string;
  values: string[];
}) => (
  <div className="flex flex-col">
    <p className="font-source font-semibold text-base text-neutral-800 px-6 py-4">
      {heading}
    </p>
    {values.map((value, index) => (
      <p
        key={index}
        className={`font-source text-base text-neutral-800 px-6 py-4 h-14 flex items-center ${
          index % 2 === 0 ? "bg-charcoal-100" : "bg-white"
        }`}
      >
        {value}
      </p>
    ))}
  </div>
);

const InterviewerAvatars = ({
  interviewers,
}: Pick<InterviewInviteResult, "interviewers">) => {
  if (interviewers.length === 0) return null;

  return (
    <span className="flex shrink-0 items-center">
      {interviewers.map((interviewer, index) => (
        <Avatar
          key={interviewer.id}
          className="!h-[42px] !w-[42px] !text-base [&:not(:last-child)]:-mr-2.5"
          sx={{
            zIndex: interviewers.length - index,
            bgcolor: index % 2 === 0 ? "#C4C4C4" : "#9f9f9f",
          }}
        >
          {interviewer.firstName[0]?.toUpperCase()}
        </Avatar>
      ))}
    </span>
  );
};
