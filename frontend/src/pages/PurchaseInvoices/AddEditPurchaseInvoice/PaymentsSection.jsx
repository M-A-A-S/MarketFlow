import { useState } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import { PAYMENT_METHOD, PAYMENT_METHODS } from "../../../utils/constants";
import { PlusCircle, Trash, Trash2 } from "lucide-react";
import PaymentMethodSelect from "../../../components/Selects/PaymentMethodSelect";
import Input from "../../../components/UI/Input";
import TextArea from "../../../components/UI/TextArea";
import Button from "../../../components/UI/Button";
import { formatMoney } from "../../../utils/utils";

const purchasePaymentData = {
  id: "",
  paymentMethod: PAYMENT_METHOD.CASH,
  amount: "",
  paymentDate: new Date().toISOString(),
  transactionReference: "",
  notes: "",
};

const PaymentsSection = ({
  payments,
  setPayments,
  isModeUpdate,
  calculateRemainingAmount,
  calculateNetTotal,
}) => {
  const [newPayment, setNewPayment] = useState(purchasePaymentData);
  const [errors, setErrors] = useState({});

  const addPayment = (e) => {
    e?.preventDefault();

    if (!validateFormData()) {
      return;
    }

    if (isModeUpdate) {
      setPayments((prev) => [...prev, { ...newPayment, id: Date.now() }]);
    } else {
      setPayments([newPayment]);
    }

    setNewPayment(purchasePaymentData);
  };

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

  const updateField = (name, value) => {
    setNewPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (value) => {
    const remainingAmount = calculateRemainingAmount();
    const safeValue = Math.max(
      0,
      Math.min(parseFloat(value) || 0, remainingAmount),
    );
    updateField("amount", safeValue);
  };

  const validateFormData = () => {
    let newErrors = {};

    const amount = parseFloat(newPayment.amount);

    if (!amount || amount <= 0) {
      newErrors.amount = "invalid amount";
    }

    const limit = isModeUpdate
      ? calculateRemainingAmount()
      : calculateNetTotal();

    if (amount > limit) {
      newErrors.amount = "Amount exceeds allowed limit";
    }

    if (!newPayment.paymentMethod) {
      newErrors.paymentMethod = "apayment Method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { translations, language } = useLanguage();

  const {
    payment_title,
    payment_method,
    payment_amount,
    payment_ref,
    payment_notes,
  } = translations.pages.purchase_invoice_page;

  const { add } = translations.common;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <h2 className="text-lg font-semibold mb-4">{payment_title}</h2>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <PaymentMethodSelect
            value={newPayment.paymentMethod}
            onChange={(e) => updateField("paymentMethod", e.target.value)}
            label={payment_method}
            showLabel={true}
            errorMessage={errors.paymentMethod}
          />
        </div>
        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <Input
            type="number"
            value={newPayment.amount}
            // onChange={(e) => updateField("amount", e.target.value)}
            onChange={(e) => handleAmountChange(e.target.value)}
            label={payment_amount}
            showLabel={true}
            errorMessage={errors.amount}
          />
        </div>
        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <Input
            value={newPayment.transactionReference}
            onChange={(e) =>
              updateField("transactionReference", e.target.value)
            }
            label={payment_ref}
            showLabel={true}
            errorMessage={errors.transactionReference}
          />
        </div>
        <div className="flex-1 min-w-[200px] max-w-[400px]">
          <TextArea
            value={newPayment.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            label={payment_notes}
            showLabel={true}
            errorMessage={errors.notes}
          />
        </div>

        <Button onClick={addPayment}>
          <PlusCircle /> {add}
        </Button>
      </div>

      {payments.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center 
              bg-gray-50 dark:bg-slate-800 p-3 rounded-lg 
              border border-gray-200 dark:border-gray-700"
            >
              <div>
                <p className="font-medium">
                  {getPaymentMethodName(p.paymentMethod)}{" "}
                  <span className="text-gray-500 font-normal">
                    • ${formatMoney(p.amount)}
                  </span>
                </p>
                {p.transactionReference && (
                  <p className="text-xs text-gray-500">
                    {payment_ref}: {p.transactionReference}
                  </p>
                )}
              </div>
              <button
                onClick={() => removePayment(p.id)}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-100 p-1.5 rounded transition"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default PaymentsSection;
