import { toast } from "./toastHelper";
import { translationsFiles } from "../locales/index.jsx";
import { PAYMENT_METHODS, PURCHASE_INVOICE_STATUSES } from "./constants.jsx";

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

export const formatNumber = (value, language = "en") => {
  const number = Number(value || 0);

  if (isNaN(number)) return "0";

  return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US").format(
    number,
  );
};

export const formatDate = (isoString, language = "en") => {
  if (!isoString) return "";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString(language === "en" ? "en-US" : "ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (isoString, language = "en") => {
  if (!isoString) return "";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleString(language === "en" ? "en-US" : "ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatShortDate = (date, language = "en") => {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    language === "en" ? "en-GB" : "ar-EG",
  );
};

export const getStatusName = (value) => {
  const status = PURCHASE_INVOICE_STATUSES.find(
    (invoice) => invoice.value == value,
  );
  const translations = getTranslations();

  return translations.purchase_invoice_status?.[status?.key] ?? "-";
};

export const getPaymentMethodName = (value) => {
  const method = PAYMENT_METHODS.find(
    (paymentMethod) => paymentMethod.value == value,
  );
  const translations = getTranslations();
  return translations.payment_methods?.[method?.label] ?? "-";
};

export const getFullName = (person) => {
  if (!person) {
    return "-";
  }

  return `${person.firstName} ${person.lastName}`;
};
