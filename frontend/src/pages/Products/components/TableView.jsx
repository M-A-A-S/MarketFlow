import Table from "../../../components/UI/Table";
import { useLanguage } from "../../../hooks/useLanguage";
import { formatMoney, formatNumber } from "../../../utils/utils";
import ProductActions from "./ProductActions";

const TableView = ({ products, handleEdit, handleDelete }) => {
  const { translations } = useLanguage();

  const {
    image,
    nameEn,
    nameAr,
    descriptionEn,
    descriptionAr,
    price,
    stockQuantity,
    category,
    brand,
  } = translations.pages.products_page;

  const { actions } = translations.common;

  const headers = [
    image,
    nameEn,
    nameAr,
    descriptionEn,
    descriptionAr,
    price,
    stockQuantity,
    category,
    brand,
    actions,
  ];

  const data = products?.map((product) => ({
    image: product.imageUrl ? (
      <img
        src={product.imageUrl}
        alt={product.nameEn}
        className="h-10 w-10 object-cover rounded"
      />
    ) : null,

    nameEn: <small>{product.nameEn}</small>,
    nameAr: <small>{product.nameAr}</small>,

    descriptionEn: <small>{product.descriptionEn}</small>,
    descriptionAr: <small>{product.descriptionAr}</small>,

    price: <small>{formatMoney(product.price)}</small>,
    stockQuantity: <small>{formatNumber(product.stockQuantity)}</small>,

    category: (
      <small>
        {translations.language === "en"
          ? product.category.nameEn
          : product.category.nameAr}
      </small>
    ),
    brand: (
      <small>
        {translations.language === "en"
          ? product.brand.nameEn
          : product.brand.nameAr}
      </small>
    ),

    actions: (
      <ProductActions
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        product={product}
        className="justify-center"
      />
    ),
  }));

  return <Table headers={headers} data={data} />;
};
export default TableView;
