import Table from "../../../components/UI/Table";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatDate, formatMoney } from "../../../utils/utils";
import PurchaseInvoiceActions from "./PurchaseInvoiceActions";
import PurchaseInvoiceStatusBadge from "./PurchaseInvoiceStatusBadge";

const TableView = ({
  purchaseInvoices,
  handleEdit,
  handleDelete,
  getFullName,
  getStatusName,
}) => {
  const { translations } = useLanguage();

  const {
    invoice_no,
    invoice_date,
    supplier,
    net_total,
    total_paid,
    remaining,
  } = translations.pages.purchase_invoice_page;

  const { actions, status } = translations.common;

  const { delete_label, cancel } = translations.common;

  const headers = [
    invoice_no,
    invoice_date,
    supplier,
    status,
    net_total,
    total_paid,
    remaining,
    actions,
  ];

  const data = purchaseInvoices?.map((invoice) => ({
    invoice_number: <small>{invoice.invoiceNumber}</small>,

    invoice_date: <small>{formatDate(invoice.invoiceDate)}</small>,

    supplier: <small>{getFullName(invoice?.supplier?.person)}</small>,

    status: (
      <PurchaseInvoiceStatusBadge
        status={invoice?.status}
        statusName={getStatusName(invoice?.status)}
      />
    ),

    net_total: <small>{formatMoney(invoice.netTotal)}</small>,

    total_paid: (
      <small className="text-green-600">
        {formatMoney(invoice.paidAmount)}
      </small>
    ),

    remaining: (
      <small className="text-red-500">
        {formatMoney(invoice.remainingAmount)}
      </small>
    ),

    actions: (
      <PurchaseInvoiceActions
        purchaseInvoice={invoice}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        className="justify-center"
      />
    ),
  }));

  return <Table headers={headers} data={data} />;
};
export default TableView;
