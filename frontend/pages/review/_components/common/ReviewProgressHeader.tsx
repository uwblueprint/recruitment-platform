import { CheckIcon } from "@/components/icons/check.icon";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { ReviewStage } from "../constants";
import { ReviewSetStageContext } from "../ReviewContext";

interface Props {
  currentStage: ReviewStage;
}

type StepState = "current" | "completed" | "future";

interface StepConfig {
  label: string;
  index: number;
  stage: ReviewStage;
}

const steps: StepConfig[] = [
  { label: "Info", index: 1, stage: ReviewStage.INFO },
  { label: "PFSG", index: 2, stage: ReviewStage.PFSG },
  { label: "TEAM", index: 3, stage: ReviewStage.TP },
  { label: "LEARN", index: 4, stage: ReviewStage.D2L },
  { label: "SKILL", index: 5, stage: ReviewStage.SKL },
  { label: "END", index: 6, stage: ReviewStage.END },
];

const getStepState = (step: StepConfig, currentIndex: number): StepState => {
  const stepIndex = steps.indexOf(step);
  if (stepIndex === currentIndex) return "current";
  if (stepIndex < currentIndex) return "completed";
  return "future";
};

const circleClasses: Record<StepState, string> = {
  completed: "border-[#7EAE5A] bg-[#7EAE5A]",
  current: "border-white bg-white",
  future: "border-white bg-transparent",
};

const numberClasses: Record<StepState, string> = {
  completed: "text-sm text-white",
  current: "text-sm font-bold text-blue",
  future: "text-sm text-white",
};

interface StepIndicatorProps {
  step: StepConfig;
  state: StepState;
}

const StepIndicator = ({ step, state }: StepIndicatorProps) => {
  const setStage = useContext(ReviewSetStageContext);

  const content = (
    <>
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${circleClasses[state]}`}
      >
        {state === "completed" ? (
          <CheckIcon className="h-5 w-5 text-white" />
        ) : (
          <span className={numberClasses[state]}>{step.index}</span>
        )}
      </div>
      <span className="text-xs font-medium uppercase tracking-wide text-white">
        {step.label}
      </span>
    </>
  );

  return (
    <button
      type="button"
      onClick={() => setStage?.(step.stage)}
      className="flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
      aria-label={`Navigate to ${step.label} step`}
    >
      {content}
    </button>
  );
};

export const ReviewProgressHeader = ({ currentStage }: Props) => {
  const currentIndex = steps.findIndex((s) => s.stage === currentStage);

  return (
    <header className="w-full bg-blue">
      <div className="flex w-full items-center justify-between px-9 py-4">
        {/* Left side - Logo */}
        <Link href="/review">
          <Image
            src="/common/logo-with-text.svg"
            alt="Blueprint Logo"
            width={206}
            height={41}
            className="cursor-pointer"
          />
        </Link>

        {/* Right side - Progress Stepper */}
        <div className="hidden items-center gap-9 md:flex">
          {steps.map((step) => (
            <StepIndicator
              key={step.index}
              step={step}
              state={getStepState(step, currentIndex)}
            />
          ))}
        </div>
      </div>
    </header>
  );
};
