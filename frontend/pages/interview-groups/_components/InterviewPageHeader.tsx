import { LongLeftIcon } from "@/components/icons/long-left.icon";
import Link from "next/link";

const InterviewPageHeader = () => (
  <div className="flex flex-col gap-3">
    <Link
      href="/admin"
      className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-full border-2 border-blue bg-white px-4 py-2 font-source text-base font-normal leading-[1.4] text-blue no-underline hover:bg-sky-100 hover:opacity-90"
      passHref
    >
      <LongLeftIcon />
      Back to home
    </Link>
    <p className="font-poppins text-[28px] font-semibold leading-[1.4] text-semantic-text-primary">
      Interview Pairing
    </p>
    <p className="font-poppins text-[20px] font-normal leading-[1.4] text-black">
      Review & coordinate your interviews with your partner
    </p>
  </div>
);

export default InterviewPageHeader;
