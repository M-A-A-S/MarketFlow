import CustomerCard from "./CustomerCard";

const CardView = ({ customers, handleEditCustomer, handleDeleteCustomer }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 transition-all duration-300">
      {customers?.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          handleEditCustomer={handleEditCustomer}
          handleDeleteCustomer={handleDeleteCustomer}
        />
      ))}
    </div>
  );
};
export default CardView;
