import Select from "../../../../components/UI/Select";
import { useLanguage } from "../../../../hooks/useLanguage";
import { PPRDUCT_SORT_BY_OPTIONS } from "../../../../utils/constants";
import { safeCall } from "../../../../utils/utils";

const ProductSortBySelect = ({
  value,
  onChange,
  label,
  errorMessage,
  showLabel,
}) => {
  const handleChange = safeCall(onChange);
  const { translations } = useLanguage();

  const options = PPRDUCT_SORT_BY_OPTIONS?.map((option) => ({
    value: option.value,
    label: translations?.product_sort_by?.[option.label] ?? option.label,
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
export default ProductSortBySelect;
