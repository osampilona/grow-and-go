import { memo, useCallback, useMemo } from "react";
import { useCategoryStore } from "../stores/categoryStore";

interface CategoryButtonProps {
  category: { id: string; name: string; img?: string; imgColored?: string };
  showBorder?: boolean;
}

const CategoryButton = memo(function CategoryButton({ 
  category,
  showBorder = false
}: CategoryButtonProps) {
  // Optimize store subscriptions - use individual selectors to minimize re-renders
  const hasHydrated = useCategoryStore((state) => state.hasHydrated);
  const isTempSelected = useCategoryStore((state) => state.isTempSelected(category.id));
  const toggleTempCategory = useCategoryStore((state) => state.toggleTempCategory);
  const getIconForCategory = useCategoryStore((state) => state.getIconForCategory);
  const isEverythingTempSelected = useCategoryStore((state) => state.isTempSelected("everything")); // retained in case styling depends on it

  // MEMOIZED: Click handler with stable reference
  const handleClick = useCallback(() => {
    toggleTempCategory(category.id);
  }, [toggleTempCategory, category.id]);

  // MEMOIZED: Selection state to prevent recalculation
  const isSelectedState = useMemo(() => 
    hasHydrated ? isTempSelected : category.id === "everything",
    [hasHydrated, isTempSelected, category.id]
  );
  
  // MEMOIZED: Icon source to prevent recalculation
  const iconSrc = useMemo(() => {
    const storeIconSrc = getIconForCategory(category.id);
    return storeIconSrc || (isSelectedState ? category.imgColored : category.img);
  }, [getIconForCategory, category.id, category.img, category.imgColored, isSelectedState]);
  
  // MEMOIZED: Gray out state to prevent recalculation
  // In single-select mode, gray out only non-selected items (no special multi-select logic needed)
  const shouldGrayOut = useMemo(() => !isSelectedState, [isSelectedState]);

  // MEMOIZED: Static styles to prevent recreation
  const buttonStyle = useMemo(() => ({ minWidth: 66 }), []);
  const imageStyle = useMemo(() => ({ minWidth: 28, minHeight: 28 }), []);

  // MEMOIZED: Button className to prevent recalculation
  const buttonClassName = useMemo(() => 
    `flex flex-col items-center px-2 py-1 rounded-lg hover:bg-default-100 focus:outline-none transition-all duration-150 cursor-pointer ` +
    (isSelectedState 
      ? "bg-stone-200/80 backdrop-blur-sm dark:bg-white/10 dark:backdrop-blur-sm" 
      : "") +
    (showBorder
      ? " border border-default-500 dark:border-default-600"
      : ""),
    [isSelectedState, showBorder]
  );

  // MEMOIZED: Image className to prevent recalculation
  const imageClassName = useMemo(() => 
    `w-7 h-7 mb-1 object-contain transition-all duration-150 ` +
    (shouldGrayOut 
      ? "opacity-60 dark:invert" 
      : isSelectedState ? "" : "dark:invert"),
    [shouldGrayOut, isSelectedState]
  );

  // MEMOIZED: Text className to prevent recalculation
  const textClassName = useMemo(() => 
    `text-xs font-semibold ` +
    (shouldGrayOut
      ? "text-foreground/60"
      : "text-foreground"),
    [shouldGrayOut]
  );

  return (
    <button
      onClick={handleClick}
      className={buttonClassName}
      style={buttonStyle}
      role="radio"
      aria-checked={isSelectedState}
      aria-label={category.name}
      type="button"
    >
      {iconSrc && (
        <img
          src={iconSrc}
          alt=""
          className={imageClassName}
          style={imageStyle}
        />
      )}
      <span className={textClassName}>
        {category.name}
      </span>
    </button>
  );
});

export default CategoryButton;
