import PurchaseInvoiceCard from "./PurchaseInvoiceCard";

const CardView = ({
  purchaseInvoices,
  handleEdit,
  handleDelete,
  getFullName,
  getStatusName,
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 transition-all duration-300">
      {purchaseInvoices?.map((purchaseInvoice) => (
        <PurchaseInvoiceCard
          key={purchaseInvoice.id}
          purchaseInvoice={purchaseInvoice}
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
