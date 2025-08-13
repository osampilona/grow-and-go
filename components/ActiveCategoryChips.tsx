import { memo, useMemo } from "react";
import { Chip } from "@heroui/chip";
import { useCategoryStore } from "../stores/categoryStore";
import { categories } from "../stores/categoryStore";
import { getCategoryChipProps } from "@/utils/colors";

interface ActiveCategoryChipsProps {
  onClearCategory: (category: string) => void;
}

export const ActiveCategoryChips = memo(function ActiveCategoryChips({
  onClearCategory
}: ActiveCategoryChipsProps) {
  const tempSelected = useCategoryStore((state) => state.tempSelected);
  // Check temp state instead of applied state
  const isTempEverythingSelected = useCategoryStore((state) => state.isTempSelected("everything"));

  // Create a map for quick category name lookup
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  // Centralized colors for each category
  const categoryColors = useMemo(() => (
    categories.reduce((acc, category) => {
      acc[category.id] = getCategoryChipProps(category.id);
      return acc;
    }, {} as Record<string, any>)
  ), []);

  // Memoize the category chips to prevent unnecessary re-renders
  const categoryChips = useMemo(() => {
    if (isTempEverythingSelected || tempSelected.length === 0) return null;
    const selected = tempSelected.find(c => c !== "everything");
    if (!selected) return null;
    return (
      <div className="flex flex-wrap gap-2">
        <Chip
          key={selected}
          onClose={() => onClearCategory(selected)}
          variant="flat"
          {...(categoryColors[selected] || { color: "secondary" })}
          size="sm"
          className="text-xs"
        >
          {categoryMap[selected] || selected.charAt(0).toUpperCase() + selected.slice(1)}
        </Chip>
      </div>
    );
  }, [tempSelected, isTempEverythingSelected, onClearCategory, categoryMap, categoryColors]);

  return categoryChips;
});
