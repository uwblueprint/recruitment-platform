type CalendlyLinkFormProps = {
  linkInput: string;
  onLinkChange: (value: string) => void;
  onSubmit: () => void;
};

const CalendlyLinkForm = ({
  linkInput,
  onLinkChange,
  onSubmit,
}: CalendlyLinkFormProps) => (
  <div className="flex flex-col gap-8 rounded-lg border border-semantic-border-light p-6">
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="font-poppins text-xl font-medium leading-[1.4] text-blue">
          Paste Calendly link below
        </p>
        <p className="font-source text-base leading-[1.4] text-black/75">
          Paste your completed Calendly link here below. This link will be used
          by Admins to send out to your interviewees.
        </p>
      </div>
      <input
        type="text"
        placeholder="Paste link here"
        value={linkInput}
        onChange={(e) => onLinkChange(e.target.value)}
        className="w-full rounded-[5px] border border-semantic-border-input px-5 py-[10px] text-sm font-normal leading-[1.43] text-charcoal-400 outline-none focus:border-blue"
      />
    </div>
    <div className="flex justify-end">
      <button
        disabled={!linkInput}
        onClick={onSubmit}
        className={`rounded-full bg-blue px-4 py-2 font-source text-base font-normal leading-[1.4] text-white ${
          !linkInput ? "cursor-not-allowed opacity-50" : "hover:opacity-90"
        }`}
      >
        Submit Link
      </button>
    </div>
  </div>
);

export default CalendlyLinkForm;
