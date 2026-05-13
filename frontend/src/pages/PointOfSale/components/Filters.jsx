import Input from "../../../components/UI/Input";
import { useLanguage } from "../../../hooks/useLanguage";
import CategorySelect from "../../../components/Selects/CategorySelect";
import BrandSelect from "../../../components/Selects/BrandSelect";

const Filters = ({
  categoryId,
  setCategoryId,
  brandId,
  setBrandId,
  search,
  setSearch,
}) => {
  const { translations } = useLanguage();

  const {
    search_placeholder,
    search: search_label,
    clear,
    status: status_label,
  } = translations.common;

  const { category, brand } = translations.pages.point_of_sale_page;

  return (
    <div className="flex flex-wrap items-center gap-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition border border-transparent p-3 ">
      <Input
        className="flex-1 min-w-[200px] max-w-[400px] m-0"
        label={search_label}
        name="product-search"
        placeholder={search_placeholder}
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex-1 min-w-[200px] max-w-[400px]">
        <CategorySelect
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          label={category}
          showLabel={true}
        />
      </div>
      <div className="flex-1 min-w-[200px] max-w-[400px]">
        <BrandSelect
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          label={brand}
          showLabel={true}
        />
      </div>
    </div>
  );
};
export default Filters;
