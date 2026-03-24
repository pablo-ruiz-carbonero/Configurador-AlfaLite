// CustomSelect.tsx
import { useState, useRef, useEffect } from "react";

interface Option {
  code: string;
  label: string;
  flag: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (code: string) => void;
}

export function CustomSelect({ options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.code === value) ?? options[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`custom-select ${open ? "open" : ""}`} ref={ref}>
      <div
        className="custom-select__trigger"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
          if (e.key === "Escape") setOpen(false);
        }}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>
          {current.flag} {current.label}
        </span>
        <ChevronIcon />
      </div>

      <div className="custom-select__dropdown" role="listbox">
        {options.map((lang) => (
          <div
            key={lang.code}
            className={`custom-select__option ${lang.code === value ? "selected" : ""}`}
            role="option"
            aria-selected={lang.code === value}
            onClick={() => {
              onChange(lang.code);
              setOpen(false);
            }}
          >
            <span className="check" />
            <span className="flag">{lang.flag}</span>
            <span>{lang.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ChevronIcon = () => (
  <svg
    className="custom-select__chevron"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 6 8 10 12 6" />
  </svg>
);
