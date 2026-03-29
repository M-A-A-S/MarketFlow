import { safeCall } from "../../utils/utils";

const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = "",
  errorMessage = "",
  ...props
}) => {
  const handleChange = safeCall(onChange);
  console.log("Checkbox rendered with checked:", checked);
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer select-none mb-2 mt-2
        ${disabled ? "cursor-not-allowed opacity-60" : ""}
        ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        {...props}
        // className={`
        //   h-5 w-5 rounded-md border-2
        //   bg-gray-50 dark:bg-slate-800
        //   border-gray-300 dark:border-gray-700
        //   text-orange-600 focus:ring-2 focus:ring-orange-500
        //   ${errorMessage ? "border-orange-500" : ""}
        // `}
        className={`
          h-5 w-5 rounded-md border-2 cursor-pointer
          bg-gray-50 dark:bg-slate-800
          border-gray-300 dark:border-gray-700
          text-orange-600 
          ${errorMessage ? "border-orange-500" : ""}
        `}
      />

      {label && (
        <span className="text-sm text-gray-700 dark:text-gray-200">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
