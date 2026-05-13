import Table from "../../../components/UI/Table";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatDate, formatMoney } from "../../../utils/utils";
import SaleInvoiceActions from "./SaleInvoiceActions";
import SaleInvoiceStatusBadge from "./SaleInvoiceStatusBadge";

const TableView = ({
  saleInvoices,
  handleEdit,
  handleDelete,
  getStatusName,
  getFullName,
}) => {
  const { translations } = useLanguage();

  const {
    invoice_number,
    invoice_date,
    customer,
    net_total,
    total_paid,
    remaining,
  } = translations.pages.sale_invoice_page;

  const { actions, status } = translations.common;

  const headers = [
    invoice_number,
    invoice_date,
    customer,
    status,
    net_total,
    total_paid,
    remaining,
    actions,
  ];

  const data = saleInvoices?.map((invoice) => ({
    invoice_number: <small>{invoice.invoiceNumber}</small>,

    invoice_date: <small>{formatDate(invoice.invoiceDate)}</small>,

    customer: <small>{getFullName(invoice?.customer?.person)}</small>,

    status: (
      <SaleInvoiceStatusBadge
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
      <SaleInvoiceActions
        saleInvoice={invoice}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        className="justify-center"
      />
    ),
  }));

  return <Table headers={headers} data={data} />;
};
export default TableView;
