import Input from "../../../../components/UI/Input";
import { useLanguage } from "../../../../hooks/useLanguage";
import BrandSelect from "../BrandSelect";
import CategorySelect from "../CategorySelect";
import ProductSortBySelect from "./ProductSortBySelect";
import StatusSelect from "../StatusSelect";
import { X } from "lucide-react";
import { PPRDUCT_SORT_BY } from "../../../../utils/constants";

const ProductFiltersContainer = ({
  searchText,
  handleSearchInputChange,
  sortBy,
  handleSortByChange,
  minPrice,
  handleMinPriceChange,
  maxPrice,
  handleMaxPriceChange,
  categoryId,
  handleCategoryChange,
  brandId,
  handleBrandChange,
  isActive,
  handleIsActiveChange,
  handleClearFilters,
}) => {
  const { translations } = useLanguage();

  const { search_placeholder, search, clear } = translations.common;

  const {
    category_id_label,
    category_id_placeholder,
    brand_id_label,
    brand_id_placeholder,
    is_active_label,
    is_active_placeholder,
    min_price_label,
    min_price_placeholder,
    max_price_label,
    max_price_placeholder,
    sort_by_label,
    sort_by_placeholder,
  } = translations.product_filters;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 w-full">
        <Input
          className="flex-1 min-w-[200px] max-w-[400px]"
          label={search}
          name="product-search"
          placeholder={search_placeholder}
          type="search"
          value={searchText}
          onChange={handleSearchInputChange}
        />

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <ProductSortBySelect
            value={sortBy}
            onChange={handleSortByChange}
            label={sort_by_label}
            showLabel={true}
          />
        </div>

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <CategorySelect
            value={categoryId}
            onChange={handleCategoryChange}
            label={category_id_label}
            showLabel={true}
          />
        </div>
        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <BrandSelect
            value={brandId}
            onChange={handleBrandChange}
            label={brand_id_label}
            showLabel={true}
          />
        </div>

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <StatusSelect
            value={isActive}
            onChange={handleIsActiveChange}
            showLabel={true}
          />
        </div>

        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <Input
            className="flex-1 min-w-[200px]"
            label={min_price_label}
            name="min-price"
            placeholder={min_price_placeholder}
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            showLabel={true}
          />
        </div>
        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <Input
            className="flex-1 min-w-[200px]"
            label={max_price_label}
            name="max-price"
            placeholder={max_price_placeholder}
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            showLabel={true}
          />
        </div>
      </div>
      {(searchText ||
        sortBy ||
        categoryId ||
        brandId ||
        isActive ||
        minPrice ||
        maxPrice) && (
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
export default ProductFiltersContainer;
