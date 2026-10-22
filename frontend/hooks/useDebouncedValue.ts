import { useEffect, useState } from "react";

/**
 * Returns `value` only once it has stopped changing for `delayMs`, so typing
 * into an input fires one query on the settled text rather than one per
 * keystroke. The input itself stays on the raw value and remains responsive.
 */
const useDebouncedValue = <T>(value: T, delayMs = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debouncedValue;
};

export default useDebouncedValue;
