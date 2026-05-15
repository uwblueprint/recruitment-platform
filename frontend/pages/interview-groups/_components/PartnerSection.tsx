type Partner = {
  firstName: string;
  lastName: string;
  email: string;
};

type PartnerSectionProps = {
  partner: Partner | null;
  applicantNames: string;
};

const PartnerSection = ({ partner, applicantNames }: PartnerSectionProps) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
      <p className="font-poppins text-xl font-medium leading-[1.4] text-blue">
        1. Your interview partner:
      </p>
      <p className="font-source text-base leading-[1.4] text-black/75">
        Contact your interview partner, email is provided below.
      </p>
    </div>
    <div className="flex items-center justify-between gap-3 rounded-lg border border-semantic-border-light p-4">
      <div className="flex items-center gap-3">
        <div className="h-[42px] w-[42px] shrink-0 rounded-full bg-charcoal-200" />
        <div className="flex flex-col gap-1">
          <span className="font-poppins text-base font-medium leading-[1.4] text-semantic-text-primary">
            {partner ? `${partner.firstName} ${partner.lastName}` : "—"}
          </span>
          <span className="font-source text-sm leading-[1.4] text-semantic-text-primary">
            Interviewing: {applicantNames}
          </span>
        </div>
      </div>
      <a
        href={partner ? `mailto:${partner.email}` : undefined}
        className="font-source text-base leading-[1.4] text-semantic-text-link no-underline hover:underline"
      >
        {partner?.email ?? "—"}
      </a>
    </div>
  </div>
);

export default PartnerSection;
