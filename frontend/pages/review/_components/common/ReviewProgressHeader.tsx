import { CheckIcon } from "@/components/icons/check.icon";
import { blue, green, neutral } from "@/constants/palette";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useContext } from "react";
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

const StepIndicator = ({ step, state }: StepIndicatorProps) => {
  const setStage = useContext(ReviewSetStageContext);

  const circleStyleObjects: Record<StepState, CSSProperties> = {
    completed: {
      backgroundColor: green[500],
      borderColor: green[500],
    },
    current: {
      backgroundColor: neutral[50],
      borderColor: neutral[50],
    },
    future: {
      backgroundColor: "transparent",
      borderColor: neutral[50],
    },
  };

  const numberStyleObjects: Record<StepState, CSSProperties> = {
    completed: { color: neutral[50] },
    current: { color: blue[500], fontWeight: 700 },
    future: { color: neutral[50] },
  };

  const content = (
    <>
      <div
        className="w-9 h-9 rounded-full border-2 flex items-center justify-center"
        style={circleStyleObjects[state]}
      >
        {state === "completed" ? (
          <CheckIcon className="w-5 h-5" style={{ color: neutral[50] }} />
        ) : (
          <span className={`text-sm`} style={numberStyleObjects[state]}>
            {step.index}
          </span>
        )}
      </div>
      <span className="text-white text-xs font-medium uppercase tracking-wide">
        {step.label}
      </span>
    </>
  );

  return (
    <button
      type="button"
      onClick={() => setStage?.(step.stage)}
      className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
      aria-label={`Navigate to ${step.label} step`}
    >
      {content}
    </button>
  );
};

export const ReviewProgressHeader = ({ currentStage }: Props) => {
  const currentIndex = steps.findIndex((s) => s.stage === currentStage);

  return (
    <header className="w-full" style={{ backgroundColor: blue[500] }}>
      <div className="flex items-center justify-between px-9 py-4 w-full">
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
        <div className="hidden md:flex items-center gap-9">
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
