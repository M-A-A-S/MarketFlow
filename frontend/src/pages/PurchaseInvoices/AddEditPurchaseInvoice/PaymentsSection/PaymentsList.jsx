import PaymentItem from "./PaymentItem";

const PaymentsList = ({
  payments,
  onRemove,
  getPaymentMethodName,
  payment_ref,
}) => {
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
      {payments.map((p) => (
        <PaymentItem
          key={p.id}
          payment={p}
          onRemove={onRemove}
          getPaymentMethodName={getPaymentMethodName}
          payment_ref={payment_ref}
        />
      ))}
    </div>
  );
};

export default PaymentsList;
