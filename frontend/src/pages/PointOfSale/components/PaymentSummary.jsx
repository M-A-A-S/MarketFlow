import { formatMoney } from "../../../utils/utils";
import { useLanguage } from "../../../hooks/useLanguage";

const PaymentSummary = ({ total, paid, remaining }) => {
  const { translations } = useLanguage();

  const {
    total: total_label,
    paid: paid_label,
    remaining: remaining_label,
  } = translations.pages.point_of_sale_page;

  return (
    <div className="mt-3 text-sm space-y-1 border-t pt-3 dark:border-slate-600">
      <div className="flex justify-between">
        <span>{total_label}</span>
        <span className="font-bold">${formatMoney(total)}</span>
      </div>

      <div className="flex justify-between text-green-600">
        <span>{paid_label}</span>
        <span>${formatMoney(paid)}</span>
      </div>

      <div className="flex justify-between text-red-500">
        <span>{remaining_label}</span>
        <span>${formatMoney(remaining)}</span>
      </div>
    </div>
  );
};

export default PaymentSummary;
