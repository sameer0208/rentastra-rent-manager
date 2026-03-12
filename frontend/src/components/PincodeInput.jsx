import { useRef, useEffect, useCallback } from "react";

const LENGTH = 6;

export default function PincodeInput({ value = "", onChange, disabled, className = "", inputClassName = "" }) {
  const digits = value.replace(/\D/g, "").slice(0, LENGTH).split("");
  const refs = useRef([]);

  const setDigit = useCallback(
    (index, char) => {
      const next = value.replace(/\D/g, "").slice(0, LENGTH).split("");
      next[index] = char;
      onChange(next.join("").slice(0, LENGTH));
    },
    [value, onChange]
  );

  const focus = useCallback((index) => {
    refs.current[index]?.focus();
  }, []);

  useEffect(() => {
    refs.current = refs.current.slice(0, LENGTH);
  }, []);

  const handleKeyDown = (index, e) => {
    if (e.key !== "Backspace") return;
    if (digits[index]) {
      setDigit(index, "");
      e.preventDefault();
      return;
    }
    if (index > 0) {
      setDigit(index - 1, "");
      focus(index - 1);
      e.preventDefault();
    }
  };

  const handleInput = (index, e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 1) {
      const chars = raw.slice(0, LENGTH).split("");
      const next = [...digits];
      chars.forEach((c, i) => {
        if (index + i < LENGTH) next[index + i] = c;
      });
      onChange(next.join("").slice(0, LENGTH));
      const nextFocus = Math.min(index + chars.length, LENGTH - 1);
      focus(nextFocus);
      e.preventDefault();
      return;
    }
    const char = raw.slice(-1);
    if (char) {
      setDigit(index, char);
      if (index < LENGTH - 1) focus(index + 1);
    }
    e.preventDefault();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    const next = pasted.split("");
    while (next.length < LENGTH) next.push("");
    onChange(next.join("").slice(0, LENGTH));
    focus(Math.min(pasted.length, LENGTH - 1));
  };

  return (
    <div className={`flex gap-1.5 justify-center ${className}`}>
      {Array.from({ length: LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={digits[i] ?? ""}
          disabled={disabled}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onInput={(e) => handleInput(i, e)}
          onPaste={handlePaste}
          className={`w-10 h-11 sm:w-11 sm:h-12 text-center text-lg font-semibold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60 ${inputClassName}`}
          aria-label={`Pincode digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
