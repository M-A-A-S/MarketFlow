import ProductCard from "./ProductCard";

const CardView = ({ products, handleEdit, handleDelete }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 transition-all duration-300">
      {products?.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};
export default CardView;
