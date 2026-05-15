import { CheckCircleIcon } from "@/components/icons/check-circle.icon";
import { EditIcon } from "@/components/icons/edit.icon";

type CalendlyLinkSubmittedProps = {
  linkInput: string;
  onLinkChange: (value: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  onResubmit: () => void;
};

const CalendlyLinkSubmitted = ({
  linkInput,
  onLinkChange,
  isEditing,
  onEdit,
  onResubmit,
}: CalendlyLinkSubmittedProps) => (
  <div className="flex gap-4 rounded-lg border border-semantic-border-light py-6 pr-6 pl-4">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-semantic-state-success text-white">
      <CheckCircleIcon />
    </div>
    <div className="flex flex-1 flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="font-poppins text-xl font-medium leading-[1.4] text-semantic-text-success">
            Link submitted!
          </p>
          <p className="font-source text-base leading-[1.4] text-black/75">
            If you would like to re-submit your Calendly link press the edit
            icon below.
          </p>
        </div>
        {isEditing ? (
          <input
            type="text"
            value={linkInput}
            onChange={(e) => onLinkChange(e.target.value)}
            className="w-full rounded-[5px] border border-semantic-border-input px-5 py-[10px] text-sm font-normal leading-[1.43] text-charcoal-400 outline-none focus:border-blue"
          />
        ) : (
          <div className="flex items-center gap-[10px] rounded-[5px] border border-semantic-border-input px-5 py-[10px]">
            <span className="flex-1 truncate text-sm font-normal leading-[1.43] text-semantic-text-link">
              {linkInput}
            </span>
            <button
              onClick={onEdit}
              className="shrink-0 hover:opacity-70"
              aria-label="Edit link"
            >
              <EditIcon />
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          disabled={!isEditing || !linkInput}
          onClick={onResubmit}
          className={`rounded-full bg-blue px-4 py-2 font-source text-base font-normal leading-[1.4] text-white ${
            !isEditing || !linkInput
              ? "cursor-not-allowed opacity-50"
              : "hover:opacity-90"
          }`}
        >
          Re-submit link
        </button>
      </div>
    </div>
  </div>
);

export default CalendlyLinkSubmitted;
