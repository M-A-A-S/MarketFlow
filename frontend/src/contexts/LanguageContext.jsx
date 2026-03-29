import { createContext, useEffect, useState } from "react";
import { translationsFiles } from "../locales/index.jsx";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("market-flow-language") || "en";
  });

  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute(
      "dir",
      language === "ar" ? "rtl" : "ltr",
    );
    localStorage.setItem("market-flow-language", language);
  }, [language]);

  if (language === "ar") {
    document.documentElement.classList.add("font-arabic");
    document.documentElement.classList.remove("font-sans");
  } else {
    document.documentElement.classList.add("font-sans");
    document.documentElement.classList.remove("font-arabic");
  }

  const translations =
    language === "en" ? translationsFiles.en : translationsFiles.ar;

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <LanguageContext.Provider
      value={{ language, translations, toggleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
