import { PlusCircle } from "lucide-react";
import PaymentMethodSelect from "../../../../components/Selects/PaymentMethodSelect";
import Button from "../../../../components/UI/Button";
import Input from "../../../../components/UI/Input";
import TextArea from "../../../../components/UI/TextArea";
import { useState } from "react";
import { useLanguage } from "../../../../hooks/useLanguage";
import { PAYMENT_METHOD } from "../../../../utils/constants";

const purchasePaymentData = {
  id: "",
  paymentMethod: PAYMENT_METHOD.CASH,
  amount: "",
  paymentDate: new Date().toISOString(),
  transactionReference: "",
  notes: "",
};

const PaymentForm = ({
  setPayments,
  isModeUpdate,
  calculateRemainingAmount,
  calculateNetTotal,
}) => {
  const [newPayment, setNewPayment] = useState(purchasePaymentData);
  const [errors, setErrors] = useState({});

  const { translations, language } = useLanguage();

  const {
    payment_method,
    payment_amount,
    payment_ref,
    payment_notes,
    payment_amount_error,
    payment_amount_exceed,
    payment_method_error,
  } = translations.pages.purchase_invoice_page;

  const { add } = translations.common;

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
      newErrors.amount = payment_amount_error;
    }

    const limit = isModeUpdate
      ? calculateRemainingAmount()
      : calculateNetTotal();

    if (amount > limit) {
      newErrors.amount = payment_amount_exceed;
    }

    if (!newPayment.paymentMethod) {
      newErrors.paymentMethod = payment_method_error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PaymentMethodSelect
          value={newPayment.paymentMethod}
          onChange={(e) => updateField("paymentMethod", e.target.value)}
          label={payment_method}
          showLabel
          errorMessage={errors.paymentMethod}
        />

        <Input
          type="number"
          value={newPayment.amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          label={payment_amount}
          showLabel
          errorMessage={errors.amount}
        />

        <Input
          value={newPayment.transactionReference}
          onChange={(e) => updateField("transactionReference", e.target.value)}
          label={payment_ref}
          showLabel
        />

        <TextArea
          value={newPayment.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          label={payment_notes}
          showLabel
          className="md:col-span-2 lg:col-span-4"
        />
      </div>

      {/* Button row */}
      <div className="flex justify-end mt-5">
        <Button
          onClick={addPayment}
          className="flex items-center gap-2 px-4 py-2"
        >
          <PlusCircle size={18} />
          {add}
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;
