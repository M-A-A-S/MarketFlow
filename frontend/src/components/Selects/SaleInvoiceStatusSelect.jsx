import { useLanguage } from "../../hooks/useLanguage";
import { SALE_INVOICE_STATUSES } from "../../utils/constants";
import { safeCall } from "../../utils/utils";
import Select from "../UI/Select";

const SaleInvoiceStatusSelect = ({
  value,
  onChange,
  label,
  errorMessage,
  showLabel,
}) => {
  const handleChange = safeCall(onChange);
  const { translations } = useLanguage();

  const options = SALE_INVOICE_STATUSES?.map((option) => ({
    value: option.value,
    label: translations?.sale_invoice_status?.[option.key] ?? option.key,
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
export default SaleInvoiceStatusSelect;
