import { memo, useCallback } from "react";
import { useCategoryStore } from "../stores/categoryStore";

interface CategoryButtonProps {
  category: { id: string; name: string; img?: string; imgColored?: string };
}

const CategoryButton = memo(function CategoryButton({ 
  category
}: CategoryButtonProps) {
  // Get state and actions directly from global store
  const hasHydrated = useCategoryStore((state) => state.hasHydrated);
  const isSelected = useCategoryStore((state) => state.isSelected(category.id));
  const toggleCategory = useCategoryStore((state) => state.toggleCategory);
  const getIconForCategory = useCategoryStore((state) => state.getIconForCategory);
  const isEverythingSelected = useCategoryStore((state) => state.isSelected("everything"));

  const handleClick = useCallback(() => {
    toggleCategory(category.id);
  }, [toggleCategory, category.id]);

  // During SSR or before hydration, show default state
  const isSelectedState = hasHydrated ? isSelected : category.id === "everything";
  const iconSrc = getIconForCategory(category.id);
  
  // Don't gray out categories when "Everything" is selected
  const shouldGrayOut = !isEverythingSelected && !isSelectedState;

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center px-2 py-1 rounded-lg hover:bg-default-100 focus:outline-none bg-transparent transition-all duration-150 cursor-pointer"
      style={{ minWidth: 66 }}
    >
      {iconSrc && (
        <img
          src={iconSrc}
          alt=""
          className={
            `w-7 h-7 mb-1 object-contain transition-all duration-150 ` +
            (shouldGrayOut 
              ? "opacity-60 dark:invert" 
              : "dark:invert")
          }
          style={{ minWidth: 28, minHeight: 28 }}
        />
      )}
      <span className={
        `text-xs font-semibold ` +
        (shouldGrayOut
          ? "text-foreground/60"
          : "text-foreground")
      }>
        {category.name}
      </span>
    </button>
  );
});

export default CategoryButton;
