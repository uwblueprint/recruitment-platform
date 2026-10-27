import {
  InterviewPartnerCard,
  type InterviewPartner,
} from "@/components/common/InterviewPartnerCard";

type PartnerSectionProps = {
  partner: InterviewPartner | null;
  applicantNames: string;
};

const PartnerSection = ({ partner, applicantNames }: PartnerSectionProps) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
      <p className="font-poppins font-medium text-xl text-blue leading-[1.4]">
        1. Your interview partner:
      </p>
      <p className="font-source text-base text-black/75 leading-[1.4]">
        Contact your interview partner, email is provided below.
      </p>
    </div>
    <InterviewPartnerCard partner={partner} applicantNames={applicantNames} />
  </div>
);

export default PartnerSection;
