import { User } from "lucide-react";
import Table from "../../../components/UI/Table";
import { useLanguage } from "../../../hooks/useLanguage";
import CustomerActions from "./CustomerActions";

const TableView = ({ customers, handleEditCustomer, handleDeleteCustomer }) => {
  const { translations } = useLanguage();

  const { first_name, last_name, phone, image } =
    translations.pages.customers_page;

  const { actions } = translations.common;

  const headers = [image, first_name, last_name, phone, actions];

  const data = customers?.map((customer) => {
    return {
      image: customer?.imageUrl ? (
        <img
          src={customer?.imageUrl}
          alt={`${customer.firstName} ${customer.lastName}`}
          className="h-10 w-10 object-cover rounded-full"
        />
      ) : (
        <User size={24} className="text-gray-400" />
      ),
      first_name: <small>{customer.firstName}</small>,
      last_name: <small>{customer.lastName}</small>,
      phone: <small>{customer.phone}</small>,
      // dateOfBirth: person.dateOfBirth ? (
      //   <small>{formatDate(person.dateOfBirth)}</small>
      // ) : null,
      actions: (
        <CustomerActions
          handleEditCustomer={handleEditCustomer}
          handleDeleteCustomer={handleDeleteCustomer}
          customer={customer}
          className="justify-center"
        />
      ),
    };
  });

  return <Table headers={headers} data={data} />;
};
export default TableView;
