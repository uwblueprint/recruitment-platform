import { InterviewPartnerCard as PartnerCard } from "@/components/common/InterviewPartnerCard";
import useInterviewPartner from "../hooks/useInterviewPartner";
import { useAuthenticatedUser } from "@/components/contexts/AuthUserContext";

interface InterviewPartnerCardProps {
  className?: string;
}

export const InterviewPartnerCard = ({
  className,
}: InterviewPartnerCardProps) => {
  const curUser = useAuthenticatedUser();
  const { partner, interviewingNames } = useInterviewPartner(curUser?.id);

  if (!partner) return null;

  return (
    <div className={`flex w-full flex-col gap-3 ${className ?? ""}`}>
      <p className="font-poppins text-xl font-normal leading-[1.4] text-black">
        Your interview partner is:
      </p>
      <PartnerCard
        partner={partner}
        applicantNames={interviewingNames.join(", ")}
      />
    </div>
  );
};
