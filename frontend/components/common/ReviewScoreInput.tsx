import { UpCaret } from "@/components/icons/up-caret.icon";
import React, { ReactElement } from "react";

interface Props {
  id: string;
  value: number | "";
  min: number;
  max: number;
  placeholder: string;
  ariaLabel: string;
  onChange: (value: number) => void;
  className?: string;
}

export function ReviewScoreInput({
  id,
  value,
  min,
  max,
  placeholder,
  ariaLabel,
  onChange,
  className = "w-[280px]",
}: Props): ReactElement {
  const numericValue = value === "" ? NaN : value;
  const canIncrement = Number.isNaN(numericValue) || numericValue < max;
  const canDecrement = Number.isNaN(numericValue) || numericValue > min;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(0);
      return;
    }
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n)) {
      onChange(Math.min(max, Math.max(min, n)));
    }
  };

  const handleIncrement = () => {
    const next = Number.isNaN(numericValue)
      ? min
      : Math.min(max, numericValue + 1);
    onChange(next);
  };

  const handleDecrement = () => {
    const next = Number.isNaN(numericValue)
      ? max
      : Math.max(min, numericValue - 1);
    onChange(next);
  };

  return (
    <div
      className={`flex h-12 shrink-0 items-center overflow-hidden rounded-[8px] border border-neutral-200 bg-white font-source focus-within:ring-2 focus-within:ring-blue/20 ${className}`}
      role="group"
    >
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={handleInputChange}
        className="h-full min-w-0 flex-1 self-stretch border-0 bg-white px-5 text-base font-normal text-neutral-800 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div
        className="w-px shrink-0 self-stretch bg-neutral-200"
        aria-hidden
      />
      <div className="flex h-full w-6 shrink-0 flex-col bg-white">
        <button
          type="button"
          onClick={handleIncrement}
          disabled={!canIncrement}
          aria-label="Increase score"
          className="flex min-h-0 flex-1 items-center justify-center border-b border-neutral-200 bg-white text-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <UpCaret />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!canDecrement}
          aria-label="Decrease score"
          className="flex min-h-0 flex-1 items-center justify-center bg-white text-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <UpCaret direction="down" />
        </button>
      </div>
    </div>
  );
}
