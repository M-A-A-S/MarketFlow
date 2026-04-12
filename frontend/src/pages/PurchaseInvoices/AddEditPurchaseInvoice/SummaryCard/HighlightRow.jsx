import { formatMoney } from "../../../../utils/utils";

const HighlightRow = ({ label, value, type = "default" }) => {
  const styles = {
    discount: "text-green-600 bg-green-50 dark:bg-green-200 dak:text-green-900",
    tax: "bg-gray-50 dark:bg-slate-700",
    default: "bg-gray-50",
  };

  return (
    <div
      className={`flex justify-between text-sm px-2 py-1 rounded ${styles[type]}`}
    >
      <span>{label}</span>
      <span>
        {type === "discount" ? "-" : "+"}${formatMoney(value)}
      </span>
    </div>
  );
};

export default HighlightRow;
