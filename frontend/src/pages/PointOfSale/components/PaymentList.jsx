import { formatDateTime, formatMoney } from "../../../utils/utils";
import { PAYMENT_METHODS } from "../../../utils/constants";
import { X } from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";

const PaymentList = ({ payments = [], setPayments }) => {
  const { translations } = useLanguage();

  const removePayment = (id) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  function getPaymentMethodName(value) {
    const method = PAYMENT_METHODS.find((item) => item.value == value);
    if (!method) {
      return null;
    }

    return translations?.payment_methods?.[method.label] || method.label;
  }

  return (
    <div className="mt-3 space-y-2">
      {payments.map((payment, index) => (
        <div
          key={payment.id || index}
          className="flex justify-between items-center bg-gray-50 dark:bg-slate-700 p-2 rounded-lg"
        >
          <div>
            <p className="text-sm font-medium">
              {getPaymentMethodName(payment.method)}
            </p>
            <p className="text-xs text-gray-500">
              {formatDateTime(payment.date)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold">${formatMoney(payment.amount)}</span>

            <button
              onClick={() => removePayment(payment.id)}
              className="text-red-500 text-xs"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentList;
