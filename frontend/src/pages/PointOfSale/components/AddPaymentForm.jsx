import { useState } from "react";
import PaymentMethodSelect from "../../../components/Selects/PaymentMethodSelect";
import Input from "../../../components/UI/Input";
import Button from "../../../components/UI/Button";
import { useLanguage } from "../../../hooks/useLanguage";
import { PAYMENT_METHOD } from "../../../utils/constants";
import { toast } from "../../../utils/toastHelper";

const AddPaymentForm = ({ remaining, paid, setPayments, total }) => {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.CASH);
  const [amount, setAmount] = useState("");
  const [transactionReference, setTransactionReference] = useState("");

  const { translations } = useLanguage();

  const {
    add_payment,
    payment_amount,
    payment_method,
    transaction_reference,
    transaction_reference_placeholder,
    payment_error,
    payment_completed,
    payment_added,
    remaining: remaining_label,
  } = translations.pages.point_of_sale_page;

  const addPayment = () => {
    const paidAmount = Number(amount);

    if (paidAmount > remaining || paidAmount <= 0) {
      toast.error(payment_error);
      return;
    }

    const newPayment = {
      id: Date.now(),
      paymentMethod,
      amount: paidAmount,
      transactionReference: transactionReference,
      date: new Date().toISOString(),
    };

    setPayments((prev) => [...prev, newPayment]);

    const newPaid = paid + newPayment.amount;
    const newRemaining = total - newPaid;

    if (Number(newRemaining) == 0) {
      toast.success(payment_completed);
    } else {
      toast.success(`${payment_added} ${remaining_label}:  ${newRemaining}`);
    }

    setAmount("");
    setTransactionReference("");
  };

  return (
    <div className="mt-3 space-y-2">
      <PaymentMethodSelect
        showLabel={true}
        value={paymentMethod}
        label={payment_method}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />

      <Input
        placeholder={payment_amount}
        label={payment_amount}
        value={amount}
        type="number"
        min={0}
        max={remaining}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input
        placeholder={transaction_reference_placeholder}
        label={transaction_reference}
        value={transactionReference}
        onChange={(e) => setTransactionReference(e.target.value)}
      />

      <Button className="w-full justify-center" onClick={addPayment}>
        {add_payment}
      </Button>
    </div>
  );
};

export default AddPaymentForm;
