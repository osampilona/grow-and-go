import { memo } from "react";
import { useCategoryStore } from "../stores/categoryStore";
import CategoryButton from "./CategoryButton";

const CategoriesList = memo(function CategoriesList() {
  const categories = useCategoryStore((state) => state.categories);
  
  return (
    <div
      className="grid grid-cols-3 gap-3 md:flex md:gap-3 md:justify-center md:overflow-x-auto custom-scrollbar"
      style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
    >
      {categories.map((category) => (
        <CategoryButton
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
});

export default CategoriesList;
