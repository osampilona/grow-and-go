import { memo, useCallback } from "react";
import { useCategoryStore } from "../stores/categoryStore";

interface CategoryButtonProps {
  category: { id: string; name: string; img?: string; imgColored?: string };
  showBorder?: boolean;
}

const CategoryButton = memo(function CategoryButton({ 
  category,
  showBorder = false
}: CategoryButtonProps) {
  // Use individual subscriptions to avoid selector recreation issues
  const hasHydrated = useCategoryStore((state) => state.hasHydrated);
  const isTempSelected = useCategoryStore((state) => state.isTempSelected(category.id));
  const toggleTempCategory = useCategoryStore((state) => state.toggleTempCategory);
  const getIconForCategory = useCategoryStore((state) => state.getIconForCategory);
  const isEverythingTempSelected = useCategoryStore((state) => state.isTempSelected("everything"));

  const handleClick = useCallback(() => {
    toggleTempCategory(category.id);
  }, [toggleTempCategory, category.id]);

  // During SSR or before hydration, show default state
  const isSelectedState = hasHydrated ? isTempSelected : category.id === "everything";
  
  // Get icon from store if available, otherwise use the category prop directly  
  const storeIconSrc = getIconForCategory(category.id);
  const iconSrc = storeIconSrc || (isSelectedState ? category.imgColored : category.img);
  
  // Don't gray out categories when "Everything" is selected
  const shouldGrayOut = !isEverythingTempSelected && !isSelectedState;

  return (
    <button
      onClick={handleClick}
      className={
        `flex flex-col items-center px-2 py-1 rounded-lg hover:bg-default-100 focus:outline-none bg-transparent transition-all duration-150 cursor-pointer ` +
        (isSelectedState 
          ? "dark:bg-white/10 dark:backdrop-blur-sm" 
          : "") +
        (showBorder
          ? " border border-default-500 dark:border-default-600"
          : "")
      }
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
              : isSelectedState ? "" : "dark:invert")
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
