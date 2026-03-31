import { useLanguage } from "../../hooks/useLanguage";

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  className = "",
  required = false,
  disabled = false,
  errorMessage = "",
  showLabel = false,
  multiple = false,
  ...props
}) => {
  const { language } = useLanguage();

  return (
    <div className={`flex flex-col gap-1  ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`text-sm font-medium capitalize tracking-wide cursor-pointer ${
            !showLabel ? "sr-only" : ""
          }`}
        >
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        required={required}
        disabled={disabled}
        multiple={multiple}
        className={`
          w-full cursor-pointer rounded-xl border-2 px-4 py-2 text-sm
          bg-gray-50 dark:bg-slate-800 
          border-gray-200 dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-purple-500
          focus:border-purple-500
          disabled:cursor-not-allowed disabled:opacity-60
          ${
            errorMessage
              ? "border-red-500"
              : "border-gray-300 hover:border-gray-400"
          }
        `}
        {...props}
      >
        <option value="" disabled>
          {language === "en" ? "Select an option" : "اختر خيارًا"}
        </option>

        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default Select;
