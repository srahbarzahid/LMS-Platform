import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const CustomDropdown = ({ value, onChange, options, className = "", align = "right", icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getOptionValue = (opt) => (typeof opt === "object" && opt !== null ? opt.value : opt);
  const getOptionLabel = (opt) => (typeof opt === "object" && opt !== null ? opt.label : opt);

  const selectedOption = options.find((opt) => getOptionValue(opt) === value) || options[0];
  const displayLabel = selectedOption ? getOptionLabel(selectedOption) : value;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-w-[160px] gap-2 px-4 py-2.5 bg-white dark:bg-[#18181b] border border-border rounded-xl text-sm font-semibold text-heading hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-4 h-4 text-primary shrink-0" />}
          <span className="truncate">{displayLabel}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-caption shrink-0 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full ${align === "right" ? "right-0" : "left-0"} z-50 min-w-[190px] w-full mt-2 bg-white dark:bg-[#18181b] border border-border rounded-2xl shadow-xl py-1.5 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150`}
        >
          {options.map((option) => {
            const optValue = getOptionValue(option);
            const optLabel = getOptionLabel(option);
            const isSelected = optValue === value;

            return (
              <button
                key={optValue}
                type="button"
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
                    : "text-body hover:bg-gray-50 dark:hover:bg-neutral-800/70 hover:text-heading"
                }`}
              >
                <span className="truncate">{optLabel}</span>
                {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
