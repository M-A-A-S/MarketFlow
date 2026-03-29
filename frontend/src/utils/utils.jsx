import { toast } from "./toastHelper";
import { translationsFiles } from "../locales/index.jsx";

export const safeCall = (callback) => {
  return (...args) => {
    if (typeof callback === "function") {
      callback(...args);
    }
  };
};

const getTranslations = () => {
  const language = localStorage.getItem("market-flow-language") || "en";
  return language === "en" ? translationsFiles.en : translationsFiles.ar;
};

export function showSuccess(serverCode = "", frontMessage = "") {
  const translations = getTranslations();

  const message =
    (serverCode && translations?.server_codes?.[serverCode]) ||
    frontMessage ||
    translations.common.success ||
    "Operation successful!";

  toast.success(message);
}

export function showFail(serverCode = "", frontMessage = "") {
  const translations = getTranslations();

  console.log("serverCode -> ", serverCode);
  console.log("translations -> ", translations);

  const message =
    (serverCode && translations?.server_codes?.[serverCode]) ||
    frontMessage ||
    translations.common.fail ||
    "Operation failed!";

  toast.error(message);
}
