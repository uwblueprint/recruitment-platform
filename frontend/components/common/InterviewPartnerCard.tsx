import { UserAvatar } from "@/components/common/UserAvatar";

export type InterviewPartner = {
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
};

type InterviewPartnerCardProps = {
  partner: InterviewPartner | null;
  applicantNames: string;
};

export const InterviewPartnerCard = ({
  partner,
  applicantNames,
}: InterviewPartnerCardProps) => (
  <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 p-4">
    <div className="flex flex-1 items-center gap-3">
      <UserAvatar
        firstName={partner?.firstName}
        lastName={partner?.lastName}
        photoUrl={partner?.photoUrl ?? undefined}
      />
      <div className="flex flex-col gap-1 text-neutral-800">
        <p className="font-poppins text-base font-medium leading-[1.4]">
          {partner ? `${partner.firstName} ${partner.lastName}` : "—"}
        </p>
        {applicantNames && (
          <p className="font-source text-sm leading-[1.4]">
            Interviewing: {applicantNames}
          </p>
        )}
      </div>
    </div>
    <a
      href={partner ? `mailto:${partner.email}` : undefined}
      className="shrink-0 font-source text-base leading-[1.4] text-link no-underline hover:underline"
    >
      {partner?.email ?? "—"}
    </a>
  </div>
);
