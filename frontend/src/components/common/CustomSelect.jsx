import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options array into objects { value, label }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return { value: opt.value, label: opt.label || opt.value };
    }
    return { value: opt, label: opt };
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value)) || normalizedOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (disabled) return;
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-xl text-sm font-medium text-heading dark:text-neutral-100 flex items-center justify-between gap-3 outline-none transition-all cursor-pointer shadow-xs ${
          isOpen ? "border-primary ring-2 ring-primary/20 bg-white dark:bg-neutral-800" : "hover:border-gray-300 dark:hover:border-neutral-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-caption transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-2xl shadow-xl z-50 py-1.5 max-h-60 overflow-y-auto animate-in fade-in-80 zoom-in-95 duration-150">
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-3.5 py-2.5 mx-1 rounded-xl text-sm font-medium flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
                    : "text-heading dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-primary"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
