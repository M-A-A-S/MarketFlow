import { Minus, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatMoney } from "../../../utils/utils";

const CartItem = ({ cartItem, updateQuantity, removeItem }) => {
  const { translations, language } = useLanguage();

  return (
    <div
      key={cartItem.id}
      className="flex justify-between items-center border-b dark:border-b-slate-700 pb-2"
    >
      <div>
        <p className="font-semibold text-purple-700 text-sm">
          {language == "en" ? cartItem.product.nameEn : cartItem.product.nameAr}
        </p>
        <p className="text-xs text-gray-500">
          ${cartItem.product.price} × {cartItem.quantity} ={" "}
          <b>${formatMoney(cartItem.product.price * cartItem.quantity)}</b>
        </p>
      </div>

      {/* Quantity + Delete BEAUTIFUL */}
      <div className="flex items-center gap-1">
        <button
          onClick={() =>
            updateQuantity(cartItem.productId, cartItem.quantity - 1)
          }
          className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
        >
          <Minus size={14} />
        </button>

        <span className="font-bold w-6 text-center">{cartItem.quantity}</span>

        <button
          onClick={() =>
            updateQuantity(cartItem.productId, cartItem.quantity + 1)
          }
          className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
        >
          <Plus size={14} />
        </button>

        <button
          onClick={() => removeItem(cartItem.product.id)}
          className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 ml-1"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
export default CartItem;
