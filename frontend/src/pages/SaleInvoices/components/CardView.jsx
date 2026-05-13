import SaleInvoiceCard from "./SaleInvoiceCard";

const CardView = ({
  saleInvoices,
  handleEdit,
  handleDelete,
  getStatusName,
  getFullName,
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 transition-all duration-300">
      {saleInvoices?.map((saleInvoice) => (
        <SaleInvoiceCard
          key={saleInvoice.id}
          saleInvoice={saleInvoice}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          getFullName={getFullName}
          getStatusName={getStatusName}
        />
      ))}
    </div>
  );
};
export default CardView;
