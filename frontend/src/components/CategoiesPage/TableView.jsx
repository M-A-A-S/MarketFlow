import { Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import Table from "../UI/Table";
import { safeCall } from "../../utils/utils";
import CategoryActions from "./CategoryActions";

const TableView = ({
  categories,
  handleEditCategory,
  handleDeleteCategory,
}) => {
  const { translations } = useLanguage();
  const { image, nameEn, nameAr, descriptionEn, descriptionAr } =
    translations.pages.categories_page;

  const { actions } = translations.common;

  const headers = [
    image,
    nameEn,
    nameAr,
    descriptionEn,
    descriptionAr,
    actions,
  ];

  const data = categories?.map((category) => ({
    image: category.imageUrl ? (
      <img
        src={category.imageUrl}
        alt={category.nameEn}
        className="h-10 w-10 object-cover rounded"
      />
    ) : null,
    nameEn: <small>{category.nameEn}</small>,
    nameAr: <small>{category.nameAr}</small>,
    descriptionEn: <small>{category.descriptionEn}</small>,
    descriptionAr: <small>{category.descriptionAr}</small>,
    actions: (
      <CategoryActions
        handleEditCategory={handleEditCategory}
        handleDeleteCategory={handleDeleteCategory}
        category={category}
        className={"justify-center"}
      />
    ),
  }));

  return <Table headers={headers} data={data} />;
};

export default TableView;
