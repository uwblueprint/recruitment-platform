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

interface StepIndicatorProps {
  step: StepConfig;
  state: StepState;
}

const circleClassNames: Record<StepState, string> = {
  completed: "border-green bg-green text-white",
  current: "border-white bg-white text-blue",
  future: "border-white bg-transparent text-white",
};

const numberClassNames: Record<StepState, string> = {
  completed: "text-white",
  current: "font-bold text-blue",
  future: "text-white",
};

const StepIndicator = ({ step, state }: StepIndicatorProps) => {
  const setStage = useContext(ReviewSetStageContext);

  return (
    <button
      type="button"
      onClick={() => setStage?.(step.stage)}
      className="flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
      aria-label={`Navigate to ${step.label} step`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${circleClassNames[state]}`}
      >
        {state === "completed" ? (
          <CheckIcon className="h-5 w-5 text-white" />
        ) : (
          <span className={`text-sm ${numberClassNames[state]}`}>
            {step.index}
          </span>
        )}
      </div>
      <span className="text-xs font-medium uppercase tracking-wide text-white">
        {step.label}
      </span>
    </button>
  );
};

export const ReviewProgressHeader = ({ currentStage }: Props) => {
  const currentIndex = steps.findIndex((s) => s.stage === currentStage);

  return (
    <header className="w-full bg-blue">
      <div className="flex w-full items-center justify-between px-9 py-4">
        <Link href="/review">
          <Image
            src="/common/logo-with-text.svg"
            alt="Blueprint Logo"
            width={206}
            height={41}
            className="cursor-pointer"
          />
        </Link>

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
