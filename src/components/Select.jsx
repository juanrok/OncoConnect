import { useEffect, useRef, useState } from "react";

export default function Select({ placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className="selectBtn"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{value || placeholder}</span>
        <span className="chev" />
      </button>

      {open && (
        <div className="dropdown">
          {options.map((opt) => (
            <div
              key={opt}
              className="option"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}