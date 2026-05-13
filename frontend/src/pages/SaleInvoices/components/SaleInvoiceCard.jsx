import { FileText } from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";
import SaleInvoiceActions from "./SaleInvoiceActions";
import SaleInvoiceStatusBadge from "./SaleInvoiceStatusBadge";
import { formatDate, formatMoney } from "../../../utils/utils";

const SaleInvoiceCard = ({
  saleInvoice,
  handleEdit,
  handleDelete,
  getFullName,
  getStatusName,
}) => {
  const { translations } = useLanguage();

  const { customer, net_total, total_paid, remaining } =
    translations.pages.sale_invoice_page;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition border border-transparent p-4 flex flex-col">
      {/* Header */}
      <h3 className="flex items-center justify-between font-semibold text-lg">
        <span className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-purple-500">
            <FileText size={18} />
          </span>

          {saleInvoice.invoiceNumber}
        </span>

        {/* Status Badge */}
        <SaleInvoiceStatusBadge
          status={saleInvoice?.status}
          statusName={getStatusName(saleInvoice?.status)}
        />
      </h3>

      {/* Customer */}
      {saleInvoice?.customer?.person && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {customer}: {getFullName(saleInvoice?.customer?.person)}
        </p>
      )}

      {/* Date */}
      <p className="text-xs text-gray-400 mt-1">
        {formatDate(saleInvoice.invoiceDate)}
      </p>

      {/* Totals */}
      <div className="mt-3 flex justify-between text-sm text-gray-700 dark:text-gray-300">
        <span>
          {net_total}: {formatMoney(saleInvoice.netTotal)}
        </span>
      </div>

      <div className="mt-1 flex justify-between text-sm">
        <span className="text-green-600">
          {total_paid}: {formatMoney(saleInvoice.paidAmount)}
        </span>

        <span className="text-red-500">
          {remaining}: {formatMoney(saleInvoice.remainingAmount)}
        </span>
      </div>

      {/* Actions */}
      <SaleInvoiceActions
        saleInvoice={saleInvoice}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
      />
    </div>
  );
};
export default SaleInvoiceCard;
