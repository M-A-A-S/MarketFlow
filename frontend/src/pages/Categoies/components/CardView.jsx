import CategoryCard from "./CategoryCard";

const CardView = ({ categories, handleEditCategory, handleDeleteCategory }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 transition-all duration-300">
      {categories?.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          handleEditCategory={handleEditCategory}
          handleDeleteCategory={handleDeleteCategory}
        />
      ))}
    </div>
  );
};
export default CardView;
