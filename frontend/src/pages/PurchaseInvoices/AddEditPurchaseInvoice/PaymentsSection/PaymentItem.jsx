import { Trash2 } from "lucide-react";
import { useLanguage } from "../../../../hooks/useLanguage";
import { formatMoney } from "../../../../utils/utils";

const PaymentItem = ({ payment, onRemove, getPaymentMethodName }) => {
  const { translations } = useLanguage();

  const { payment_ref } = translations.pages.purchase_invoice_page;

  return (
    <div
      className="flex justify-between items-center 
      bg-gray-50 dark:bg-slate-800 p-3 rounded-lg 
      border border-gray-200 dark:border-gray-700"
    >
      <div>
        <p className="font-medium">
          {getPaymentMethodName(payment.paymentMethod)}{" "}
          <span className="text-gray-500 font-normal">
            • ${formatMoney(payment.amount)}
          </span>
        </p>

        {payment.transactionReference && (
          <p className="text-xs text-gray-500">
            {payment_ref}: {payment.transactionReference}
          </p>
        )}
      </div>

      <button
        onClick={() => onRemove(payment.id)}
        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-100 p-1.5 rounded transition"
      >
        <Trash2 />
      </button>
    </div>
  );
};

export default PaymentItem;
