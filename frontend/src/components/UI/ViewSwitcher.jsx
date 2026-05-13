import { Grid2x2, TextAlignJustify } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const ViewSwitcher = ({ view, setView }) => {
  const { translations } = useLanguage();

  const { table_view, card_view } = translations.common;

  const baseButtonClass = `
    relative
    flex items-center justify-center
    gap-2
    px-4 py-2.5
    rounded-xl
    transition-all duration-200
    text-sm font-medium
    border
  `;

  return (
    <div
      className="
        inline-flex items-center gap-1
        p-1
        rounded-2xl
        border border-gray-200 dark:border-slate-700
        bg-gray-100 dark:bg-slate-800
        shadow-sm
      "
    >
      {/* Table View */}
      <button
        type="button"
        onClick={() => setView("table")}
        title={table_view}
        className={`
          ${baseButtonClass}

          ${
            view === "table"
              ? `
                bg-purple-600
                border-purple-600
                text-white
                shadow-md
              `
              : `
                bg-transparent
                border-transparent
                text-gray-600 dark:text-gray-300
                hover:bg-white dark:hover:bg-slate-700
              `
          }
        `}
      >
        <TextAlignJustify size={18} />
        <span className="hidden sm:inline">{table_view}</span>
      </button>

      {/* Card View */}
      <button
        type="button"
        onClick={() => setView("card")}
        title={card_view}
        className={`
          ${baseButtonClass}

          ${
            view === "card"
              ? `
                bg-purple-600
                border-purple-600
                text-white
                shadow-md
              `
              : `
                bg-transparent
                border-transparent
                text-gray-600 dark:text-gray-300
                hover:bg-white dark:hover:bg-slate-700
              `
          }
        `}
      >
        <Grid2x2 size={18} />
        <span className="hidden sm:inline">{card_view}</span>
      </button>
    </div>
  );
};

export default ViewSwitcher;
