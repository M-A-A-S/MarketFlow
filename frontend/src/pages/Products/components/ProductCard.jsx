import { Layers } from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatMoney, formatNumber, safeCall } from "../../../utils/utils";
import ProductActions from "./ProductActions";

const ProductCard = ({ product, handleEdit, handleDelete }) => {
  const { language, translations } = useLanguage();

  const { category, brand, price, stockQuantity } =
    translations.pages.products_page;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition border border-transparent p-3 flex flex-col">
      {/* Product Image */}
      {product.imageUrl && (
        <div className="w-full h-36 rounded-lg overflow-hidden mb-3">
          <img
            src={product.imageUrl}
            alt={language === "en" ? product.nameEn : product.nameAr}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="flex items-center gap-2 font-semibold text-lg">
        <span className="flex items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-purple-500">
          <Layers size={18} />
        </span>
        {language === "en" ? product.nameEn : product.nameAr}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-start text-gray-600 dark:text-gray-300">
        {language === "en" ? product.descriptionEn : product.descriptionAr}
      </p>

      {/* Price and Stock */}
      <div className="mt-2 flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
        <span>
          {price}: {formatMoney(product.price)}
        </span>
        <span>
          {stockQuantity}: {formatNumber(product.stockQuantity)}
        </span>
      </div>

      {/* Category and Brand */}
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <div>
          {category}:{" "}
          {language === "en"
            ? product.category.nameEn
            : product.category.nameAr}
        </div>
        <div>
          {brand}:{" "}
          {language === "en" ? product.brand.nameEn : product.brand.nameAr}
        </div>
      </div>

      {/* Actions */}
      <ProductActions
        product={product}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
      />
    </div>
  );
};

export default ProductCard;
