import { Check } from "lucide-react";
import { formatMoney, safeCall } from "../../../../utils/utils";
import { useLanguage } from "../../../../hooks/useLanguage";
import Button from "../../../../components/UI/Button";
import SummaryRow from "./SummaryRow";
import AmountInputRow from "./AmountInputRow";
import HighlightRow from "./HighlightRow";
import BalanceCard from "./BalanceCard";

const SummaryCard = ({
  discountAmount,
  setDiscountAmount,
  taxAmount,
  setTaxAmount,
  calculateSubTotal,
  calculateNetTotal,
  calculatePaidAmount,
  calculateRemainingAmount,
  onSubmit,
}) => {
  const handleSubmit = safeCall(onSubmit);

  const { translations, language } = useLanguage();

  const {
    summary_title,
    subtotal: subtotalLabel,
    discount,
    discount_amount,
    tax,
    tax_amount,
    net_total,
    balance_title,
    total_paid,
    remaining,
    unpaid_warning,
  } = translations.pages.purchase_invoice_page;

  const { save } = translations.common;

  const subtotal = calculateSubTotal();
  const netTotal = calculateNetTotal();
  const paidAmount = calculatePaidAmount();
  const remainingAmount = calculateRemainingAmount();

  const handleDiscountAmountChange = (value) => {
    const safeValue = Math.max(0, Math.min(value, subtotal));
    setDiscountAmount(safeValue);
  };

  const handleTaxAmountChange = (value) => {
    const safeValue = Math.max(0, Math.min(value, subtotal));
    setTaxAmount(safeValue);
  };

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm 
    border border-gray-200 dark:border-gray-700 p-5 sticky top-24"
    >
      <h2 className="text-lg font-semibold mb-4 ">{summary_title}</h2>

      <div className="space-y-4">
        <SummaryRow label={subtotalLabel} value={subtotal} />

        <AmountInputRow
          label={discount}
          value={discountAmount}
          onChange={handleDiscountAmountChange}
          type="number"
        />

        {discountAmount > 0 && (
          <HighlightRow
            label={discount_amount}
            value={discountAmount}
            type="discount"
          />
        )}

        <AmountInputRow
          label={tax}
          value={taxAmount}
          onChange={handleTaxAmountChange}
          type="number"
        />

        {taxAmount > 0 && (
          <HighlightRow label={tax_amount} value={taxAmount} type="tax" />
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">{net_total}</span>
            <span className="text-2xl font-bold text-purple-600">
              ${formatMoney(netTotal)}
            </span>
          </div>
        </div>
      </div>

      <BalanceCard
        balanceTitle={balance_title}
        paidAmount={paidAmount}
        remaining={remaining}
        remainingAmount={remainingAmount}
        unpaidWarning={unpaid_warning}
      />

      <Button onClick={handleSubmit} className="w-full justify-center mt-6">
        <Check /> {save}
      </Button>
    </div>
  );
};
export default SummaryCard;
