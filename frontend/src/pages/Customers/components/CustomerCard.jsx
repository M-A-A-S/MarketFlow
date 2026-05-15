import { Phone, User } from "lucide-react";
import CustomerActions from "./CustomerActions";

const CustomerCard = ({
  customer,
  handleEditCustomer,
  handleDeleteCustomer,
}) => {
  if (!customer) return null;

  const fullName =
    customer.firstName && customer.lastName
      ? `${customer.firstName} ${customer.lastName}`
      : "Unknown Customer";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition border border-transparent p-4 flex flex-col">
      {/* Avatar / Icon */}
      <div className="w-full h-28 rounded-lg mb-3 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
        <User size={42} className="text-gray-400" />
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <User size={18} className="text-purple-500" />
        {fullName}
      </h3>

      {/* Phone */}
      {customer.phone && (
        <p className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2 gap-2">
          <Phone size={16} className="text-gray-500" />
          {customer.phone}
        </p>
      )}

      {/* Actions */}
      <CustomerActions
        customer={customer}
        handleEditCustomer={handleEditCustomer}
        handleDeleteCustomer={handleDeleteCustomer}
        className="justify-end"
      />
    </div>
  );
};
export default CustomerCard;
