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

export const formatMoney = (value, language = "en") => {
  const number = Number(value || 0);

  return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat("en-US").format(value);
};
