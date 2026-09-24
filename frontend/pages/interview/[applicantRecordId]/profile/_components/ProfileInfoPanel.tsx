import { PanelLayout } from "@/components/layouts/PanelLayout";
import { ApplicationResult } from "@/graphql/typeUtils";

interface ProfileInfoPanelProps {
  application?: ApplicationResult;
  position: string;
}

interface InfoRow {
  label: string;
  value: string;
  href?: string;
  /** "dark" = near-black profile basics, "muted" = grey questionnaire answers */
  tone?: "dark" | "muted";
}

const buildRows = (
  position: string,
  application?: ApplicationResult,
): InfoRow[] => {
  const email = application?.email ?? "";
  return [
    {
      label: "Email",
      value: email,
      href: email ? `mailto:${email}` : undefined,
    },
    { label: "Program", value: application?.program ?? "", tone: "dark" },
    { label: "Academic Term", value: application?.academicYear ?? "", tone: "dark" },
    { label: "Where did you hear about us?", value: application?.heardFrom ?? "" },
    {
      label: "How many times have you applied to Blueprint in the past?",
      value: application?.timesApplied ?? "",
    },
    { label: "What are your preferred pronouns?", value: application?.pronouns ?? "" },
    {
      label: "Will you be in an academic (school) term or a co-op term?",
      value: application?.academicOrCoop ?? "",
    },
    { label: "Position", value: position },
    {
      label: "What timezone will you be based out of?",
      value: application?.locationPreference ?? "",
    },
  ];
};

export const ProfileInfoPanel = ({
  application,
  position,
}: ProfileInfoPanelProps) => {
  const rows = buildRows(position, application);

  return (
    <PanelLayout title="Basic Information">
      <div className="my-3 flex w-full flex-col gap-6">
        {rows.map(({ label, value, href, tone }) => (
          <div key={label} className="flex flex-col items-start gap-1">
            <h5 className="font-poppins text-base font-medium leading-[1.4] text-black">
              {label}
            </h5>
            {href ? (
              <a
                href={href}
                className="font-source text-base leading-6 text-link underline decoration-solid"
              >
                {value}
              </a>
            ) : (
              <p
                className={`break-words whitespace-pre-wrap font-source text-base leading-6 ${
                  tone === "dark" ? "text-neutral-800" : "text-charcoal-500"
                }`}
              >
                {value}
              </p>
            )}
          </div>
        ))}
      </div>
    </PanelLayout>
  );
};
