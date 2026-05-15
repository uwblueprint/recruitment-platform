import { WarningOutlineIcon } from "@/components/icons/warning-outline.icon";
import { ReactElement } from "react";

interface ReportConflictButtonProps {
  name: string;
  showQuestion?: boolean;
  onClick?: () => void;
}

export const ReportConflictButton = ({
  name, // eslint-disable-line @typescript-eslint/no-unused-vars -- reserved for API
  showQuestion = false,
  onClick,
}: ReportConflictButtonProps): ReactElement => {
  const reportButton = (
    <button
      type="button"
      onClick={onClick}
      aria-label="Report conflict of interest"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[20px] border-2 border-blue bg-white px-3 py-1.5 font-source text-base font-normal leading-[1.4] text-blue transition-opacity hover:border-blue hover:bg-sky-100 hover:text-blue"
    >
      <WarningOutlineIcon className="h-6 w-6 shrink-0 text-blue" />
      <span>Report</span>
    </button>
  );

  return showQuestion ? (
    <div className="flex shrink-0 items-center gap-3">
      <p className="font-source text-base italic leading-normal text-blue">
        Is the applicant a conflict of interest?
      </p>
      {reportButton}
    </div>
  ) : (
    reportButton
  );
};
