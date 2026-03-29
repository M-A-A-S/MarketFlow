import { X } from "lucide-react";
import React from "react";

const typeStyles = {
  default:
    "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-white",
  success:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-800 dark:text-green-200",
  warning:
    "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-800 dark:text-yellow-200",
  error:
    "bg-red-100 text-red-800 border-red-300 dark:bg-red-800 dark:text-red-200",
};

const progressColors = {
  default: "bg-gray-400",
  success: "bg-green-500",
  warning: "bg-yellow-400",
  error: "bg-red-500",
};

const Toast = ({ id, message, type, onClose }) => {
  return (
    <div
      className="relative min-w-[240px] p-4 pr-12 rounded-lg 
    border shadow-md animate-slideIn bg-white dark:bg-slate-800"
    >
      {/* <div className={`${typeStyles[type]} border`}> */}
      <div className={``}>
        <span className="block bg-transparent">{message}</span>

        {/* Close button */}
        <button
          className="absolute top-2 right-2 
          text-gray-600 dark:text-gray-300 
          hover:text-black dark:hover:text-white"
          onClick={() => onClose(id)}
        >
          <X />
        </button>

        {/* Progress bar */}
        <div
          className={`absolute bottom-0 left-0 h-1 ${progressColors[type]} animate-progressBar`}
        ></div>
      </div>
    </div>
  );
};

export default Toast;
