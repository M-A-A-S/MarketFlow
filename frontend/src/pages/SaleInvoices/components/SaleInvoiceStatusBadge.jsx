import { SALE_INVOICE_STATUS } from "../../../utils/constants";

const SaleInvoiceStatusBadge = ({ status, statusName }) => {
  console.log("status -> ", status);

  const getStatusColor = (status) => {
    switch (parseInt(status)) {
      case SALE_INVOICE_STATUS.DRAFT:
        return "bg-gray-200 text-gray-700"; // Draft
      case SALE_INVOICE_STATUS.PENDING:
        return "bg-yellow-100 text-yellow-700"; // Pending
      case SALE_INVOICE_STATUS.APPROVED:
        return "bg-green-100 text-green-700"; // Approved
      case SALE_INVOICE_STATUS.CANCELLED:
        return "bg-red-100 text-red-700"; // Cancelled
      default:
        return "";
    }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(status)}`}>
      {statusName}
    </span>
  );
};
export default SaleInvoiceStatusBadge;
