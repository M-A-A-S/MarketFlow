import React from "react";
import { useLanguage } from "../../hooks/useLanguage";

const Table = ({ headers, data }) => {
  const { language, translations } = useLanguage();
  const { empty_state } = translations.common;

  return (
    <div className="w-full overflow-x-auto mb-6 ">
      <table
        className="min-w-full border-collapse bg-white dark:bg-slate-800 
       text-sm"
      >
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-2 border border-gray-300 
                 font-medium "
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
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center px-4 py-6 ">
                {empty_state}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors  ${
                  idx % 2 === 0
                    ? "bg-gray-100 dark:bg-slate-700"
                    : "bg-white dark:bg-slate-800"
                } hover:bg-gray-200 dark:hover:bg-gray-900`}
              >
                {Object.values(row).map((value, i) => (
                  <td
                    key={i}
                    className={`px-4 py-2 border border-gray-300 
                        `}
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
  );
};

export default Table;
