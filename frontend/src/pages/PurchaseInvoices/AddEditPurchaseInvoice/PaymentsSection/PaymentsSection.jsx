import { useLanguage } from "../../../../hooks/useLanguage";
import { PAYMENT_METHODS } from "../../../../utils/constants";
import PaymentsList from "./PaymentsList";
import PaymentForm from "./PaymentForm";

const PaymentsSection = ({
  payments,
  setPayments,
  isModeUpdate,
  calculateRemainingAmount,
  calculateNetTotal,
  canEditPayments,
}) => {
  const { translations } = useLanguage();

  const { payment_title } = translations.pages.purchase_invoice_page;

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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <h2 className="text-lg font-semibold mb-4">{payment_title}</h2>

      <PaymentForm
        setPayments={setPayments}
        isModeUpdate={isModeUpdate}
        calculateRemainingAmount={calculateRemainingAmount}
        calculateNetTotal={calculateNetTotal}
        canEditPayments={canEditPayments}
      />

      {payments.length > 0 && (
        <PaymentsList
          payments={payments}
          onRemove={removePayment}
          getPaymentMethodName={getPaymentMethodName}
        />
      )}
    </div>
  );
};
export default PaymentsSection;
