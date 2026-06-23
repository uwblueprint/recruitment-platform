import { Button } from "@/components/common/Button";

interface InterviewFooterProps {
  // Only shown if provided.
  onBack?: () => void;
  backLabel?: string;
  // Only shown if provided.
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
}

export const InterviewFooter = ({
  onBack,
  backLabel = "Back to home",
  onContinue,
  continueLabel = "Continue",
  continueDisabled = false,
}: InterviewFooterProps) => {
  return (
    <div className="w-full bg-white px-6 py-3 min-h-[60px]">
      <div className="flex items-center justify-end gap-3">
        {onBack && (
          <Button size="sm" variant="secondary" onClick={onBack}>
            {backLabel}
          </Button>
        )}
        {onContinue && (
          <Button size="sm" onClick={onContinue} disabled={continueDisabled}>
            {continueLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
