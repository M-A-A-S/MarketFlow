import { useLanguage } from "../../../hooks/useLanguage";
import Select from "../../../components/UI/Select";
import { read } from "../../../api/apiWrapper";
import { useEffect, useState } from "react";

const BrandSelect = ({
  value,
  onChange,
  required = false,
  disabled = false,
  errorMessage = "",
  label = "Select",
  showLabel = false,
  name,
}) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { language } = useLanguage();

  const loadingOptions = [
    {
      value: "",
      label: language === "en" ? "Loading..." : "جاري التحميل...",
    },
  ];
  const fetchBrands = async () => {
    try {
      setLoading(true);
      setIsError(false);
      const result = await read("brands");
      const options = result?.data.map((brand) => ({
        value: brand.id,
        label: language === "en" ? brand.nameEn : brand.nameAr,
      }));
      setBrands(options);
      console.log("options", options);
    } catch (error) {
      setIsError(true);
      console.error("Failed to fetch brands:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBrands();
  }, []);

  if (isError) {
    return (
      <div className="flex flex-col gap-1">
        {(showLabel || label) && (
          <label className="text-sm font-medium text-gray-700">
            {label || (language === "en" ? "Brand" : "الماركة")}
          </label>
        )}

        <div className="flex items-center gap-3 p-2 border border-red-300 rounded bg-red-50">
          <span className="text-sm text-red-600">
            {language === "en" ? "Failed to load data." : "فشل التحميل."}
          </span>
          <button
            type="button"
            onClick={fetchBrands}
            className="text-xs underline text-red-700 hover:text-red-900 font-bold"
          >
            {language === "en" ? "Retry" : "إعادة المحاولة"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Select
      options={loading ? loadingOptions : brands}
      label={label}
      value={value || ""}
      onChange={onChange}
      required={required}
      disabled={disabled || loading}
      showLabel={showLabel}
      name={name}
      errorMessage={errorMessage}
    />
  );
};
export default BrandSelect;
