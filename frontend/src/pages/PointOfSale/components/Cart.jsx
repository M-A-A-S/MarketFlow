import { ShoppingCart } from "lucide-react";
import CartItems from "./CartItems";
import { useLanguage } from "../../../hooks/useLanguage";
import AddPaymentForm from "./AddPaymentForm";
import PaymentList from "./PaymentList";
import PaymentSummary from "./PaymentSummary";
import Button from "../../../components/UI/Button";

const Cart = ({
  cart,
  total = 0,
  checkout,
  updateQuantity,
  removeItem,
  payments,
  setPayments,
  paid,
  remaining,
}) => {
  const { translations } = useLanguage();

  const {
    cart: cart_label,
    pay_now,
    empty_cart,
  } = translations.pages.point_of_sale_page;

  const items = cart?.cartItems || [];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition border border-transparent p-3">
      <h2 className="text-xl flex items-center gap-2 font-bold text-purple-800">
        <ShoppingCart /> {cart_label}
      </h2>

      {items.length === 0 ? (
        <div className="text-center text-gray-400 py-6">{empty_cart}</div>
      ) : (
        <CartItems
          cartItems={cart?.cartItems}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />
      )}

      {/* PAYMENT SECTION */}

      <AddPaymentForm
        remaining={remaining}
        paid={paid}
        setPayments={setPayments}
        total={total}
      />

      <PaymentList payments={payments} setPayments={setPayments} />

      <PaymentSummary total={total} paid={paid} remaining={remaining} />

      <Button className="w-full justify-center my-2" onClick={checkout}>
        {pay_now}
      </Button>
    </div>
  );
};
export default Cart;
