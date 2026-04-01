import Table from "../../../components/UI/Table";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatDate } from "../../../utils/utils";
import SupplierActions from "./SupplierActions";

const TableView = ({ suppliers, handleEditSupplier, handleDeleteSupplier }) => {
  const { translations } = useLanguage();

  const { firstName, lastName, phone, dateOfBirth, image } =
    translations.pages.suppliers_page;

  const { actions } = translations.common;

  const headers = [image, firstName, lastName, phone, dateOfBirth, actions];

  const data = suppliers?.map((supplier) => {
    const person = supplier?.person || {};

    return {
      image: person.imageUrl ? (
        <img
          src={person.imageUrl}
          alt={`${person.firstName} ${person.lastName}`}
          className="h-10 w-10 object-cover rounded-full"
        />
      ) : (
        <User size={24} className="text-gray-400" />
      ),
      firstName: <small>{person.firstName}</small>,
      lastName: <small>{person.lastName}</small>,
      phone: <small>{person.phone}</small>,
      dateOfBirth: person.dateOfBirth ? (
        <small>{formatDate(person.dateOfBirth)}</small>
      ) : null,
      actions: (
        <SupplierActions
          handleEditSupplier={handleEditSupplier}
          handleDeleteSupplier={handleDeleteSupplier}
          supplier={supplier}
          className="justify-center"
        />
      ),
    };
  });

  return <Table headers={headers} data={data} />;
};
export default TableView;
