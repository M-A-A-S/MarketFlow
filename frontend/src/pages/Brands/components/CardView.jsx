import BrandCard from "./BrandCard";

const CardView = ({ brands, handleEdit, handleDelete }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 transition-all duration-300">
      {brands?.map((brand) => (
        <BrandCard
          key={brand.id}
          brand={brand}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default CardView;
