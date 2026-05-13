import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const Pagination = ({
  currentPage,
  totalItems,
  onPageChange,
  pageSize = 10,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const { language } = useLanguage();

  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const generatePages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("start-ellipsis");
    }

    const start = Math.max(currentPage - 1, 2);
    const end = Math.min(currentPage + 1, totalPages - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("end-ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = generatePages();

  const buttonClass =
    "min-w-[42px] h-[42px] flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 border";

  return (
    <div
      className="
      flex items-center justify-center gap-2 
      my-6 flex-wrap
    "
    >
      {/* Prev */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          ${buttonClass}
          px-3 gap-1
          border-gray-200 dark:border-slate-700
          bg-white dark:bg-slate-800
          text-gray-700 dark:text-gray-200
          hover:bg-gray-100 dark:hover:bg-slate-700
          disabled:opacity-40
          disabled:cursor-not-allowed
          shadow-sm
        `}
      >
        {language === "en" ? (
          <ChevronLeft size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </button>

      {/* Numbers */}
      {pages.map((page, index) => {
        if (typeof page !== "number") {
          return (
            <div
              key={index}
              className="
                w-10 h-10 flex items-center justify-center
                text-gray-400 dark:text-gray-500
              "
            >
              <MoreHorizontal size={18} />
            </div>
          );
        }

        const isActive = currentPage === page;

        return (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`
              ${buttonClass}

              ${
                isActive
                  ? `
                    bg-purple-600
                    border-purple-600
                    text-white
                    shadow-md
                    scale-105
                  `
                  : `
                    bg-white dark:bg-slate-800
                    border-gray-200 dark:border-slate-700
                    text-gray-700 dark:text-gray-200
                    hover:bg-gray-100 dark:hover:bg-slate-700
                  `
              }
            `}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          ${buttonClass}
          px-3 gap-1
          border-gray-200 dark:border-slate-700
          bg-white dark:bg-slate-800
          text-gray-700 dark:text-gray-200
          hover:bg-gray-100 dark:hover:bg-slate-700
          disabled:opacity-40
          disabled:cursor-not-allowed
          shadow-sm
        `}
      >
        {language === "en" ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )}
      </button>
    </div>
  );
};

export default Pagination;
