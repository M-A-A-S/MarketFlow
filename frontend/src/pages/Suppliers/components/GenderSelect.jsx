import Select from "../../../components/UI/Select";
import { useLanguage } from "../../../hooks/useLanguage";
import { GENDERS } from "../../../utils/constants";
import { safeCall } from "../../../utils/utils";

const GenderSelect = ({ value, onChange, label, errorMessage, showLabel }) => {
  const handleChange = safeCall(onChange);
  const { translations } = useLanguage();

  const options = GENDERS?.map((option) => ({
    value: option.value,
    label: translations?.genders?.[option.label] ?? option.label,
  }));

  console.log(options);
  console.log(GENDERS);

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
export default GenderSelect;
