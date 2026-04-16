import React from "react";
import { useLanguage } from "../../hooks/useLanguage";

const Table = ({ headers, data }) => {
  const { language, translations } = useLanguage();
  const { empty_state } = translations.common;

  return (
    <div className="w-full overflow-x-auto">
      {/* Table wrapper (card style) */}
      <div
        className="
        rounded-2xl 
        border border-gray-200/60 dark:border-gray-700/60
        bg-white dark:bg-slate-900
        shadow-sm
      "
      >
        <table className="min-w-full text-sm">
          {/* HEADER */}
          <thead className="bg-gray-50 dark:bg-slate-800/60">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="
                    px-5 py-4
                    text-xs font-semibold uppercase tracking-wider
                    text-gray-600 dark:text-gray-300
                    whitespace-nowrap
                  "
                  style={{
                    textAlign: language === "en" ? "left" : "right",
                    direction: language === "en" ? "ltr" : "rtl",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={headers.length}>
                  <div className="py-14 text-center">
                    <div className="text-gray-400 dark:text-gray-500 text-sm">
                      {empty_state}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="
                    group
                    border-t border-gray-100 dark:border-gray-800/60
                    transition-all duration-200
                    hover:bg-gray-50/70 dark:hover:bg-slate-800/40
                  "
                >
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      className="
                        px-5 py-4
                        text-gray-700 dark:text-gray-200
                        whitespace-nowrap
                        group-hover:text-gray-900 dark:group-hover:text-white
                        transition-colors
                      "
                      style={{
                        textAlign: language === "en" ? "left" : "right",
                        direction: language === "en" ? "ltr" : "rtl",
                      }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
