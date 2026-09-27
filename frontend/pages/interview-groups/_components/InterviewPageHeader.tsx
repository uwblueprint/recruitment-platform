import Link from "next/link";
import { LongLeftIcon } from "@/components/icons/long-left.icon";

const InterviewPageHeader = () => (
  <div className="flex flex-col gap-3">
    <Link href="/" className="font-source no-underline inline-flex justify-center items-center gap-2 w-fit cursor-pointer shrink-0 rounded-full py-2 px-4 border-2 border-blue bg-white text-blue text-base font-normal leading-[1.4] hover:opacity-90 hover:bg-sky-100" passHref>
        <LongLeftIcon />
        Back to home
    </Link>
    <p className="font-poppins font-semibold text-[28px] text-neutral-800 leading-[1.4]">
      Interview Pairing
    </p>
    <p className="font-poppins font-normal text-[20px] text-black leading-[1.4]">
      Review & coordinate your interviews with your partner
    </p>
  </div>
);

export default InterviewPageHeader;
