import { AlertCircle } from "lucide-react";
import SummaryRow from "./SummaryRow";
import { formatMoney } from "../../../../utils/utils";

const BalanceCard = ({
  balanceTitle,
  paidAmount,
  remaining,
  remainingAmount,
  unpaidWarning,
}) => (
  <div
    className="mt-6 bg-slate-100 dark:bg-slate-700 rounded-xl p-4 
  border border-purple-100 dark:border-gray-700"
  >
    <SummaryRow label={balanceTitle} value={paidAmount} bold />

    <div className="flex justify-between items-center mt-2">
      <span className="text-sm font-medium text-purple-800 dark:text-purple-100">
        {remaining}
      </span>
      <span
        className={`text-lg font-bold ${
          remainingAmount > 0.01 ? "text-red-600" : "text-green-600"
        }`}
      >
        ${formatMoney(Math.max(0, remainingAmount))}
      </span>
    </div>

    {remainingAmount > 0.01 && (
      <div
        className="flex items-start gap-2 mt-3 
      bg-orange-50 dark:bg-orange-100 p-2 rounded border border-orange-200"
      >
        <AlertCircle className="text-red-700" />
        <p className="text-xs text-red-700 mt-0.5">
          {unpaidWarning} ${formatMoney(remainingAmount)}
        </p>
      </div>
    )}
  </div>
);

export default BalanceCard;
