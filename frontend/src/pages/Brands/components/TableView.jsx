import { useLanguage } from "../../../hooks/useLanguage";
import Table from "../../../components/UI/Table";
import BrandActions from "./BrandActions";

const TableView = ({ brands, handleEdit, handleDelete }) => {
  const { translations } = useLanguage();

  const { image, nameEn, nameAr, descriptionEn, descriptionAr, websiteUrl } =
    translations.pages.brands_page;

  const { actions } = translations.common;

  const headers = [
    image,
    nameEn,
    nameAr,
    descriptionEn,
    descriptionAr,
    websiteUrl,
    actions,
  ];

  const data = brands?.map((brand) => ({
    image: brand.imageUrl ? (
      <img
        src={brand.imageUrl}
        alt={brand.nameEn}
        className="h-10 w-10 object-cover rounded"
      />
    ) : null,

    nameEn: <small>{brand.nameEn}</small>,
    nameAr: <small>{brand.nameAr}</small>,

    descriptionEn: <small>{brand.descriptionEn}</small>,
    descriptionAr: <small>{brand.descriptionAr}</small>,

    websiteUrl: brand.websiteUrl ? (
      <a
        href={brand.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline text-xs"
      >
        {brand.websiteUrl}
      </a>
    ) : null,

    actions: (
      <BrandActions
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        brand={brand}
        className="justify-center"
      />
    ),
  }));

  return <Table headers={headers} data={data} />;
};

export default TableView;
