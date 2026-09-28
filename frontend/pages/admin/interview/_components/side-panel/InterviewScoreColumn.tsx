import type { InterviewDashboardSidePanelResult } from "@/graphql/typeUtils";

type InterviewScoreColumnProps = {
  details: InterviewDashboardSidePanelResult;
};

export const InterviewScoreColumn = ({
  details,
}: InterviewScoreColumnProps) => {
  const interview = details.interview;
  const names =
    details.interviewers
      .map(({ firstName, lastName }) => `${firstName} ${lastName}`)
      .join(", ") || "-";
  return (
    <div className="flex min-w-0 flex-1 flex-col font-source text-sm text-neutral-800">
      <section className="mb-8 flex flex-col gap-4">
        <span className="font-semibold shrink-0 text-blue-900">Interviewers</span>
        <span className="break-words">{names}</span>
      </section>

      <dl className="flex flex-col gap-5 border-b border-black pb-4">
        <ScoreRow label="Skill" value={interview?.skill} />
        <ScoreRow label="D2L" value={interview?.desireToLearn} />
        <ScoreRow label="PFSG" value={interview?.passionFSG} />
        <ScoreRow label="Team Player" value={interview?.teamPlayer} />
      </dl>

      <div className="flex justify-end gap-3 pt-4 font-semibold text-blue-900">
        <span>Total score</span>
        <span>{details.interviewScore ?? "-"}/20</span>
      </div>

      <section className="mt-8 flex flex-col gap-3">
        <span className="font-semibold text-blue-900">Comments</span>
        <span className="whitespace-pre-wrap break-words">
          {interview?.comments || "-"}
        </span>
      </section>
    </div>
  );
};

const ScoreRow = ({
  label,
  value,
}: {
  label: string;
  value?: number | null;
}) => (
  <div className="flex w-full items-start justify-between gap-6">
    <dt className="shrink-0 font-semibold text-blue-900">{label}</dt>
    <dd className="min-w-0 text-right">{value ?? "-"}</dd>
  </div>
);
