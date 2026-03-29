import { safeCall } from "../../utils/utils";

const Button = ({
  onClick,
  children,
  className = "",
  disabled = false,
  type = "button",
  loading = false,
  isCancelBtn = false,
  ...props
}) => {
  const handleClick = safeCall(onClick);
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
      className={`px-4 py-2 rounded-xl 
        font-medium flex items-center gap-1 ${
          isCancelBtn
            ? ` bg-transparent text-black dark:text-white shadow-none
           hover:bg-gray-200 dark:hover:bg-gray-700`
            : `bg-orange-600 
        text-white  
        hover:bg-orange-700 transition-colors 
        shadow-lg shadow-sm cursor-pointer`
        }  disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
