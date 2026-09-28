import useInterviewedPairingsByUserId from "@/APIClients/useInterviewedPairingsByUserId";
import useInterviewedApplicantsByUserId from "@/APIClients/useInterviewedApplicantsByUserId";

export default function useInterviewPartner(userId?: string) {
  const pairings = useInterviewedPairingsByUserId(userId);
  const partner = pairings.data
    ?.flatMap((pairing) => pairing.groupMembers)
    .find((member) => member.id !== userId);

  // Always call the hook; it skips fetching until a partner is available.
  const applicants = useInterviewedApplicantsByUserId(partner?.id);
  const interviewingNames =
    applicants.data?.map(
      (applicant) =>
        `${applicant.applicantFirstName} ${applicant.applicantLastName}`
    ) ?? [];

  return { partner, interviewingNames };
}
