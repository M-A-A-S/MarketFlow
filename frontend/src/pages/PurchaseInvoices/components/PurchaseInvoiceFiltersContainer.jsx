import Input from "../../../components/UI/Input";
import PurchaseInvoiceSortBySelect from "../../../components/Selects/PurchaseInvoiceSortBySelect";
import { useLanguage } from "../../../hooks/useLanguage";
import SupplierSelect from "../../../components/Selects/SupplierSelect";
import PurchaseInvoiceStatusSelect from "../../../components/Selects/PurchaseInvoiceStatusSelect";
import { X } from "lucide-react";

const PurchaseInvoiceFiltersContainer = ({
  search,
  handleSearchInputChange,
  sortBy,
  handleSortByChange,
  minTotal,
  handleMinTotalChange,
  maxTotal,
  handleMaxTotalChange,
  supplierId,
  handleSupplierIdChange,
  status,
  handleStatusChange,
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
    supplier_label,
    min_total_label,
    min_total_placeholder,
    max_total_label,
    max_total_placeholder,
  } = translations.purchase_invoice_filters;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 w-full">
        <Input
          className="flex-1 min-w-[200px] max-w-[400px]"
          label={search_label}
          name="product-search"
          placeholder={search_placeholder}
          type="search"
          value={search}
          onChange={handleSearchInputChange}
        />

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <PurchaseInvoiceSortBySelect
            value={sortBy}
            onChange={handleSortByChange}
            label={sort_by_label}
            showLabel={true}
          />
        </div>

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <SupplierSelect
            value={supplierId}
            onChange={handleSupplierIdChange}
            label={supplier_label}
            showLabel={true}
          />
        </div>

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <PurchaseInvoiceStatusSelect
            value={status}
            onChange={handleStatusChange}
            showLabel={true}
            label={status_label}
          />
        </div>

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <Input
            className="flex-1 min-w-[200px]"
            label={min_total_label}
            name="min-price"
            placeholder={min_total_placeholder}
            type="number"
            value={minTotal}
            onChange={handleMinTotalChange}
            showLabel={true}
          />
        </div>
        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <Input
            className="flex-1 min-w-[200px]"
            label={max_total_label}
            name="max-price"
            placeholder={max_total_placeholder}
            type="number"
            value={maxTotal}
            onChange={handleMaxTotalChange}
            showLabel={true}
          />
        </div>
      </div>
      {(search || sortBy || supplierId || minTotal || maxTotal) && (
        <button
          type="button"
          onClick={handleClearFilters}
          className="flex items-center gap-1 rounded-md border 
          border-gray-300 dark:border-gray-600 px-3 py-2 text-sm 
          transition hover:bg-gray-100 dark:hover:bg-gray-800
          "
        >
          <X className="h-4 w-4" />
          {clear}
        </button>
      )}
    </>
  );
};
export default PurchaseInvoiceFiltersContainer;
