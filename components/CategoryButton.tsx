import { memo, useCallback } from "react";
import { useCategoryStore } from "../stores/categoryStore";

interface CategoryButtonProps {
  category: { id: string; name: string; img?: string };
  // Remove isSelected and onToggle props since we'll get them from global state
}

const CategoryButton = memo(function CategoryButton({ 
  category
}: CategoryButtonProps) {
  // Get state and actions directly from global store
  const isSelected = useCategoryStore((state) => state.isSelected(category.id));
  const toggleCategory = useCategoryStore((state) => state.toggleCategory);

  const handleClick = useCallback(() => {
    toggleCategory(category.id);
  }, [toggleCategory, category.id]);

  return (
    <button
      onClick={handleClick}
      className={
        `flex flex-col items-center px-2 py-1 focus:outline-none bg-transparent transition-all duration-150 ` +
        (isSelected
          ? "border-b-2 border-foreground"
          : "border-b-2 border-transparent")
      }
      style={{ minWidth: 66 }}
    >
      {category.img && (
        <img
          src={category.img}
          alt=""
          className="w-7 h-7 mb-1 object-contain dark:invert"
          style={{ minWidth: 28, minHeight: 28 }}
        />
      )}
      <span className={
        `text-xs font-semibold ` +
        (isSelected
          ? "text-foreground"
          : "text-foreground/70")
      }>
        {category.name}
      </span>
    </button>
  );
});

export default CategoryButton;
