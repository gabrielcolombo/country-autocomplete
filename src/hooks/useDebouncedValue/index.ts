import { useEffect, useState } from "react";

const useDebouncedValue = (value: string, delayInMs: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const handleValueChange = () => {
    const timeout = setTimeout(() => setDebouncedValue(value), delayInMs);

    return () => clearTimeout(timeout);
  }

  useEffect(handleValueChange, [value, delayInMs]);

  return debouncedValue;
}

export default useDebouncedValue;