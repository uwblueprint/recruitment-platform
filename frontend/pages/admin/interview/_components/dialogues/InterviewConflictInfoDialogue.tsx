import { Button } from "@/components/common/Button";
import { Dialogue } from "@/components/common/Dialogue";

type InterviewConflictInfoDialogueProps = {
  open: boolean;
  text: string;
  onClose: () => void;
};

export const InterviewConflictInfoDialogue = ({
  open,
  text,
  onClose,
}: InterviewConflictInfoDialogueProps) => (
  <Dialogue
    open={open}
    onClose={onClose}
    header="Issue Reported"
    text={text}
    width="340px"
    className="!p-8 gap-4"
    actionsClassName="!mt-2 !h-auto"
  >
    <div className="flex w-full">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onClose}
        className="flex-1 min-w-0 !m-0 flex w-full items-center justify-center whitespace-nowrap px-8 py-[13px]"
      >
        <span className="font-poppins text-[16px] font-medium">Close</span>
      </Button>
    </div>
  </Dialogue>
);
