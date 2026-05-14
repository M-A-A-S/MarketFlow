import { useState, useRef, useEffect } from "react";
import Input from "./Input";
import { Search } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const SearchableSelect = ({
  options = [],
  placeholder = "Search...",
  inputValue = "",
  onInputChange,
  onSelect,
  loading = false,
  valueKey = "id",
  labelKey = "name",
  disabled = false,
  label = "",
  showLabel = false,
  renderLabelOption,
}) => {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const wrapperRef = useRef(null);

  const safeOptions = Array.isArray(options) ? options : [];

  const handleChange = (e) => {
    const value = e.target.value;
    onInputChange?.(value);
    setOpen(value.trim().length > 0);
  };

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Input */}
      <Input
        disabled={disabled}
        type="search"
        placeholder={placeholder}
        icon={<Search size={16} />}
        value={inputValue}
        onChange={handleChange}
        label={label}
        showLabel={showLabel}
        onFocus={() => {
          if (inputValue?.trim()) setOpen(true);
        }}
      />

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-full 
        bg-white dark:bg-slate-800 border 
        border-gray-200 dark:border-gray-700 
        rounded-lg shadow-lg max-h-56 overflow-y-auto z-50 transition-all"
        >
          {/* Loading */}
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500">
              {language === "en" ? "Loading..." : "جاري التحميل..."}
            </div>
          )}

          {/* Empty state */}
          {!loading && safeOptions.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              {language === "en" ? "No results" : "لا توجد نتائج"}
            </div>
          )}

          {/* Options */}
          {!loading &&
            safeOptions.map((item) => (
              <div
                key={item[valueKey]}
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                }}
                className="px-4 py-3 text-sm cursor-pointer 
                hover:bg-gray-50 dark:hover:bg-slate-600 active:bg-gray-100 
                transition border-b dark:border-b-gray-700 last:border-0"
              >
                {/* {item[labelKey]} */}
                {renderLabelOption ? renderLabelOption(item) : item[labelKey]}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
