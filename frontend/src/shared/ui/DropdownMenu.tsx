import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

type DropdownItem = {
  label: string;
  value: string;
  disabled?: boolean;
};

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  error?: string;
  items: DropdownItem[];
  onChange: (value: string) => void;
};

export default function DropdownField({
  label,
  value,
  placeholder = "Select option",
  error,
  items,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = items.find((item) => item.value === value);

  // close outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      {/* Label */}
      <span className="text-start text-sm font-medium">{label}</span>

      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className={`relative w-full border-0 border-b px-2 py-3 text-left text-sm transition-colors focus:outline-none ${
            error
              ? "border-red-500 hover:bg-red-500/5"
              : "border-gray-400/40 hover:bg-blue-500/5"
          }`}
        >
          {selected ? selected.label : placeholder}

          <span className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400">
            <IoIosArrowDown
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        {/* Menu */}
        {open && (
          <div className="absolute z-10 mt-2 max-h-60 overflow-y-auto w-full rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
            {items.map((item) => (
              <button
                key={item.value}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    onChange(item.value);
                    setOpen(false);
                  }
                }}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition hover:bg-gray-100 ${
                  item.disabled ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
