import { memo } from "react";
import { useCategoryStore } from "../stores/categoryStore";
import CategoryButton from "./CategoryButton";

interface CategoriesListProps { useTemp?: boolean; }

const CategoriesList = memo(function CategoriesList({ useTemp = true }: CategoriesListProps) {
  const categories = useCategoryStore((state) => state.categories);
  return (
    <div
      className="grid grid-cols-3 gap-3 md:flex md:gap-3 md:justify-center md:overflow-x-auto custom-scrollbar"
      style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
      role={useTemp ? undefined : "radiogroup"}
      aria-label={useTemp ? undefined : "Categories"}
    >
      {categories.map((category) => (
        <CategoryButton
          key={category.id}
          category={category}
          useTemp={useTemp}
        />
      ))}
    </div>
  );
});

export default CategoriesList;
