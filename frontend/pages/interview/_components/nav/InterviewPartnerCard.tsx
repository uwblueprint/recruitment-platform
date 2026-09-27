import { useEffect, useState } from "react";
import InterviewPageAPIClient from "@/APIClients/InterviewPageAPIClient";
import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";
import { InterviewGroupMemberResult } from "@/graphql/typeUtils";

interface InterviewPartnerCardProps {
  className?: string;
}

const getInitials = (firstName: string, lastName: string): string =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

export const InterviewPartnerCard = ({
  className,
}: InterviewPartnerCardProps) => {
  const curUser = useAuthenticatedUser();
  const [partner, setPartner] = useState<InterviewGroupMemberResult | null>(
    null,
  );
  const [interviewingNames, setInterviewingNames] = useState<string[]>([]);

  useEffect(() => {
    if (!curUser?.id) return;
    let cancelled = false;

    const fetchPartner = async () => {
      try {
        const pairings =
          await InterviewPageAPIClient.getInterviewedPairingsByUserId(curUser.id);
        const foundPartner =
          pairings
            .flatMap((pairing) => pairing.groupMembers)
            .find((member) => member.id !== curUser.id);
        if (cancelled) return;
        setPartner(foundPartner ?? null);

        if (foundPartner) {
          const applicants =
            await InterviewPageAPIClient.getInterviewedApplicantsByUserId(
              foundPartner.id,
            );
          if (cancelled) return;
          setInterviewingNames(
            applicants.map(
              (applicant) =>
                `${applicant.applicantFirstName} ${applicant.applicantLastName}`,
            ),
          );
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load interview partner:", error);
      }
    };

    fetchPartner();
    return () => {
      cancelled = true;
    };
  }, [curUser?.id]);

  if (!partner) return null;

  return (
    <div className={`flex w-full flex-col gap-3 ${className ?? ""}`}>
      <p className="font-poppins text-xl font-normal leading-[1.4] text-black">
        Your interview partner is:
      </p>
      <div className="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 p-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-surface-highlight font-poppins text-sm font-medium text-neutral-800">
            {getInitials(partner.firstName, partner.lastName)}
          </div>
          <div className="flex flex-col gap-1 text-neutral-800">
            <p className="font-poppins text-base font-medium leading-[1.4]">
              {partner.firstName} {partner.lastName}
            </p>
            {interviewingNames.length > 0 ? (
              <p className="font-source text-sm leading-[1.4]">
                Interviewing: {interviewingNames.join(", ")}
              </p>
            ) : null}
          </div>
        </div>
        <a
          href={`mailto:${partner.email}`}
          className="shrink-0 font-source text-base leading-[1.4] text-link"
        >
          {partner.email}
        </a>
      </div>
    </div>
  );
};
