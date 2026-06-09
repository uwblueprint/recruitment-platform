import { CheckSharpIcon } from "@/components/icons/check-sharp.icon";

export const IssueSubmitted = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex w-[566px] min-h-[271px] flex-col items-center justify-center text-center gap-4 p-4">
        <CheckSharpIcon className="h-20 w-20 text-green-900" />
        <h2 className="font-poppins text-[40px] font-semibold leading-[140%] text-center">
          Issue has been submitted
        </h2>
        <p className="font-source text-[20px] leading-[140%] text-center font-medium">
          Admins will be notified of this issue and you will be assigned another
          applicant soon.
        </p>
      </div>
    </div>
  );
};
