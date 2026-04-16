import { useLanguage } from "../../hooks/useLanguage";
import {
  PURCHASE_INVOICE_SORT_BY,
  PURCHASE_INVOICE_SORT_OPTIONS,
} from "../../utils/constants";
import { safeCall } from "../../utils/utils";
import Select from "../UI/Select";

const PurchaseInvoiceSortBySelect = ({
  value,
  onChange,
  label,
  errorMessage,
  showLabel,
}) => {
  const handleChange = safeCall(onChange);
  const { translations } = useLanguage();

  const options = PURCHASE_INVOICE_SORT_OPTIONS?.map((option) => ({
    value: option.value,
    label: translations?.purchase_invoice_sort?.[option.key] ?? option.key,
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
export default PurchaseInvoiceSortBySelect;
