import { useLanguage } from "../../hooks/useLanguage";
import { PAYMENT_METHODS } from "../../utils/constants";
import { safeCall } from "../../utils/utils";
import Select from "../UI/Select";

const PaymentMethodSelect = ({
  value,
  onChange,
  label,
  errorMessage,
  showLabel,
}) => {
  const handleChange = safeCall(onChange);
  const { translations } = useLanguage();

  const options = PAYMENT_METHODS?.map((option) => ({
    value: option.value,
    label: translations?.payment_methods?.[option.label] ?? option.label,
  }));

  console.log(options);
  console.log(PAYMENT_METHODS);

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
export default PaymentMethodSelect;
