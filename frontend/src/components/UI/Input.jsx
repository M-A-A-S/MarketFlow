import { safeCall } from "../../utils/utils";

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  className = "",
  required = false,
  disabled = false,
  maxLength = null,
  errorMessage = "",
  showLabel = false,
  ...props
}) => {
  const handleChange = safeCall(onChange);

  return (
    <div className={className}>
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
      <input
        className="w-full px-4 py-2 my-2 bg-gray-50 dark:bg-slate-800 
        border border-gray-200 dark:border-gray-700 
        rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        {...props}
      />
      {errorMessage && <small className="text-red-500">{errorMessage}</small>}
    </div>
  );
};
export default Input;
