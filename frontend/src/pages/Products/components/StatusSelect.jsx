import Select from "../../../components/UI/Select";
import { useLanguage } from "../../../hooks/useLanguage";
import { safeCall } from "../../../utils/utils";

const StatusSelect = ({ value, onChange, label, errorMessage, showLabel }) => {
  const handleChange = safeCall(onChange);
  const { translations } = useLanguage();

  const { status, active, inactive } = translations.product_filters;

  const options = [
    { value: true, label: active },
    { value: false, label: inactive },
  ];

  return (
    <Select
      options={options}
      label={label || status}
      showLabel={showLabel}
      value={value}
      onChange={handleChange}
      errorMessage={errorMessage}
    />
  );
};
export default StatusSelect;
