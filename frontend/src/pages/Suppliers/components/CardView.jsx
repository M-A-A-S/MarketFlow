import SupplierCard from "./SupplierCard";

const CardView = ({ suppliers, handleEditSupplier, handleDeleteSupplier }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 transition-all duration-300">
      {suppliers?.map((supplier) => (
        <SupplierCard
          key={supplier.id}
          supplier={supplier}
          handleEditSupplier={handleEditSupplier}
          handleDeleteSupplier={handleDeleteSupplier}
        />
      ))}
    </div>
  );
};
export default CardView;
