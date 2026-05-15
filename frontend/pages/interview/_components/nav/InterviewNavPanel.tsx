import { ArrowLeftIcon } from "@/components/icons/arrow-left.icon";
import { ArrowRightIcon } from "@/components/icons/arrow-right.icon";
import Link from "next/link";
import { useRouter } from "next/router";
import { INTERVIEW_NAV_ITEMS } from "../constants";

interface InterviewNavPanelProps {
  candidateName: string;
}

export const InterviewNavPanel = ({
  candidateName,
}: InterviewNavPanelProps) => {
  const router = useRouter();

  const { interviewedApplicantRecordId } = router.query;
  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="flex flex-col">
      <Link
        href="/admin"
        className="flex w-fit items-center justify-center gap-2 rounded-full border-2 border-blue bg-white px-4 py-2 transition-colors hover:bg-gray-50"
      >
        <ArrowLeftIcon className="h-6 w-6 text-blue" />
        <span className="text-base font-normal leading-snug text-blue">
          Back to home
        </span>
      </Link>

      <h2 className="mt-5 font-poppins text-[28px] font-semibold leading-[140%] text-semantic-text-primary">
        {candidateName}&apos;s Interview Review
      </h2>

      <hr className="mt-8 mb-8 border-semantic-border-light" />

      <ul className="flex flex-col gap-[36px]">
        {INTERVIEW_NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <li key={item.step}>
              <Link
                href={
                  interviewedApplicantRecordId
                    ? `${item.path}?interviewedApplicantRecordId=${interviewedApplicantRecordId}`
                    : item.path
                }
                className={`flex self-stretch items-center justify-between rounded-lg px-5 py-2.5 hover:bg-semantic-bg-hover ${
                  active
                    ? "bg-semantic-bg-hover font-semibold text-blue"
                    : "font-normal text-semantic-text-primary"
                }`}
              >
                <span
                  className={`font-poppins text-xl leading-[140%] ${
                    active ? "font-semibold" : "font-normal"
                  }`}
                >
                  {item.label}
                </span>
                <ArrowRightIcon className="text-semantic-text-icon" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
