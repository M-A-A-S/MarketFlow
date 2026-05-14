import Button from "../../../components/UI/Button";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatMoney } from "../../../utils/utils";

const ProductCard = ({ product, addToCart }) => {
  const { language, translations } = useLanguage();

  const { stock, add } = translations.pages.point_of_sale_page;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition border border-transparent p-3">
      <h3 className="font-bold text-purple-800">
        {language == "en" ? product.nameEn : product.nameAr}
      </h3>
      <p className="text-sm text-gray-500">
        {stock}: {product.stockQuantity}
      </p>

      <div className="flex justify-between items-center mt-3">
        <span className="text-lg font-bold text-purple-700">
          ${formatMoney(product.price)}
        </span>

        <Button
          disabled={Number(product.stockQuantity) === 0}
          onClick={() => addToCart(product)}
        >
          {add}
        </Button>
      </div>
    </div>
  );
};
export default ProductCard;
