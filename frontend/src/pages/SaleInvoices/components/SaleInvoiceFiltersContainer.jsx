import { useLanguage } from "../../../hooks/useLanguage";
import Input from "../../../components/UI/Input";
import SaleInvoiceSortBySelect from "../../../components/Selects/SaleInvoiceSortBySelect";
import SaleInvoiceStatusSelect from "../../../components/Selects/SaleInvoiceStatusSelect";
import { X } from "lucide-react";
import { SALE_INVOICE_SORT_BY } from "../../../utils/constants";

// search = { search };
// setSearch = { setSearch };
// customerId = { customerId };
// setCustomerId = { setCustomerId };
// status = { status };
// setStatus = { setStatus };
// minTotal = { minTotal };
// setMinTotal = { setMinTotal };
// maxTotal = { maxTotal };
// setMaxTotal = { setMaxTotal };
// sortBy = { sortBy };
// setSortBy = { setSortBy };
// handleClearFilters = { handleClearFilters };

const SaleInvoiceFiltersContainer = ({
  search,
  setSearch,
  sortBy,
  setSortBy,
  minTotal,
  setMinTotal,
  maxTotal,
  setMaxTotal,
  customerId,
  setCustomerId,
  status,
  setStatus,
  handleClearFilters,
}) => {
  const { translations } = useLanguage();

  const {
    search_placeholder,
    search: search_label,
    clear,
    status: status_label,
  } = translations.common;

  const {
    sort_by_label,
    customer_label,
    min_total_label,
    min_total_placeholder,
    max_total_label,
    max_total_placeholder,
  } = translations.sale_invoice_filters;

  const hasFilters =
    search ||
    customerId ||
    status ||
    minTotal ||
    maxTotal ||
    sortBy !== SALE_INVOICE_SORT_BY.NEWEST;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 w-full">
        <Input
          className="flex-1 min-w-[200px] max-w-[400px]"
          label={search_label}
          name="invoice-search"
          placeholder={search_placeholder}
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <SaleInvoiceSortBySelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label={sort_by_label}
            showLabel={true}
          />
        </div>

        {/* <div className="flex-1 min-w-[200px] max-w-[400px]">
          <CustomerSelect
            value={customerId}
            onChange={handleCustomerIdChange}
            label={customer_label}
            showLabel={true}
          />
        </div> */}

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <SaleInvoiceStatusSelect
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            showLabel={true}
            label={status_label}
          />
        </div>

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <Input
            className="flex-1 min-w-[200px]"
            label={min_total_label}
            name="min-total"
            placeholder={min_total_placeholder}
            type="number"
            value={minTotal}
            onChange={(e) => setMinTotal(e.target.value)}
            showLabel={true}
          />
        </div>
        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <Input
            className="flex-1 min-w-[200px]"
            label={max_total_label}
            name="max-total"
            placeholder={max_total_placeholder}
            type="number"
            value={maxTotal}
            onChange={(e) => setMaxTotal(e.target.value)}
            showLabel={true}
          />
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={handleClearFilters}
          className="flex items-center gap-1 rounded-md border 
          border-gray-300 dark:border-gray-600 px-3 py-2 text-sm 
          transition hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
          {clear}
        </button>
      )}
    </>
  );
};
export default SaleInvoiceFiltersContainer;
