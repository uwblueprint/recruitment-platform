import { BlueprintLogo } from "@/components/common/BlueprintLogo";
import Link from "next/link";
import { useContext } from "react";
import { PROFILE_HEADER_STEPS } from "../constants";
import { InterviewProgressContext } from "../InterviewProgressContext";

interface HeaderStep {
  step: string;
  label: string;
  index: number;
}

interface InterviewHeaderProps {
  steps?: HeaderStep[];
  currentStep?: string;
}

export const InterviewHeader = ({
  steps = PROFILE_HEADER_STEPS,
  currentStep = steps[0]?.step,
}: InterviewHeaderProps) => {
  const progressContext = useContext(InterviewProgressContext);
  const activeStep = progressContext?.currentSubStep ?? currentStep;

  return (
    <header className="w-full bg-blue">
      <div className="flex items-center justify-between px-9 py-4">
        <Link href="/">
          <BlueprintLogo />
        </Link>

        <div className="flex items-center gap-9">
          {steps.map(({ step, label, index }) => {
            const active = step === activeStep;
            return (
              <button
                key={step}
                onClick={() => progressContext?.setCurrentSubStep(step)}
                className="flex w-[80px] flex-col items-center gap-1 transition-opacity hover:opacity-80"
                aria-label={`Navigate to ${label} step`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white ${
                    active ? "bg-white" : "bg-transparent"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      active ? "text-blue" : "text-white"
                    }`}
                  >
                    {index}
                  </span>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-white">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
