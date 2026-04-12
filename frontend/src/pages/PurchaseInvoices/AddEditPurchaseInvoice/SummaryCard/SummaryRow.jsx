import { formatMoney } from "../../../../utils/utils";

const SummaryRow = ({ label, value, bold = false }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
    <span className={bold ? "font-bold" : "font-medium"}>
      ${formatMoney(value)}
    </span>
  </div>
);

export default SummaryRow;
