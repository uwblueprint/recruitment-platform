import Link from "next/link";
import { CollapsibleRow } from "@/components/common/CollapsibleRow";
import type { InterviewUnmatchedApplicantsResult } from "@/graphql/typeUtils";

type UnmatchedApplicantsRowProps = {
  group: InterviewUnmatchedApplicantsResult;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
};

export const UnmatchedApplicantsRow = ({
  group,
  isSelected,
  onSelect,
}: UnmatchedApplicantsRowProps) => {
  const { position, applicants } = group;

  return (
    <CollapsibleRow
      title={{
        text: position,
        leftSlot: <span className="font-source text-sm">Role</span>,
      }}
      subtitles={[
        {
          text: `${applicants.length} Unmatched Applicant${
            applicants.length !== 1 ? "s" : ""
          }`,
        },
      ]}
      selection={{
        checked: isSelected,
        onChange: onSelect,
        label: `Select unmatched applicants for ${position}`,
      }}
      toggleLabel={`Unmatched applicants for ${position}`}
    >
      <Interviewees applicants={applicants} />
    </CollapsibleRow>
  );
};

const Interviewees = ({
  applicants,
}: Pick<UnmatchedApplicantsRowProps["group"], "applicants">) => (
  <div className="flex flex-col">
    <p className="font-source font-semibold text-base text-neutral-800 px-6 py-4">
      Interviewees:
    </p>
    {applicants.map(({ applicantRecordId, firstName, lastName }, index) => (
      <p
        key={applicantRecordId}
        className={`font-source text-base text-neutral-800 px-6 py-4 h-14 flex items-center ${
          index % 2 === 0 ? "bg-charcoal-100" : "bg-white"
        }`}
      >
        <Link
          href={`/review/${applicantRecordId}/view`}
          className="text-link underline"
        >
          {firstName} {lastName}
        </Link>
      </p>
    ))}
  </div>
);
