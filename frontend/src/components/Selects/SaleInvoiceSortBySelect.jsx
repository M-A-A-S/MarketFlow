import { useLanguage } from "../../hooks/useLanguage";
import { SALE_INVOICE_SORT_OPTIONS } from "../../utils/constants";
import { safeCall } from "../../utils/utils";
import Select from "../UI/Select";

const SaleInvoiceSortBySelect = ({
  value,
  onChange,
  label,
  errorMessage,
  showLabel,
}) => {
  const handleChange = safeCall(onChange);
  const { translations } = useLanguage();

  const options = SALE_INVOICE_SORT_OPTIONS?.map((option) => ({
    value: option.value,
    label: translations?.sale_invoice_sort?.[option.key] ?? option.key,
  }));

  return (
    <Select
      options={options}
      label={label}
      showLabel={showLabel}
      value={value}
      onChange={handleChange}
      errorMessage={errorMessage}
    />
  );
};
export default SaleInvoiceSortBySelect;
