import { Pencil, Printer, Trash2 } from "lucide-react";
import { safeCall } from "../../../utils/utils";
import { useLanguage } from "../../../hooks/useLanguage";
import { printPurchaseInvoice } from "../../../utils/printPurchaseInvoice";

const SaleInvoiceActions = ({
  handleDelete,
  handleEdit,
  className,
  saleInvoice,
}) => {
  const onEdit = safeCall(handleEdit);
  const onDelete = safeCall(handleDelete);

  const { language } = useLanguage();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* <button
        onClick={() => onEdit(saleInvoice)}
        className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900 transition"
      >
        <Pencil size={18} />
      </button> */}

      {/* <button
        onClick={() => onDelete(saleInvoice)}
        className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition"
      >
        <Trash2 size={18} />
      </button> */}

      <button
        onClick={() => printPurchaseInvoice(saleInvoice, language)}
        className="p-2 rounded-lg text-purple-600 hover:bg-red-50 dark:hover:bg-purple-900 transition"
      >
        <Printer size={18} />
      </button>
    </div>
  );
};
export default SaleInvoiceActions;
