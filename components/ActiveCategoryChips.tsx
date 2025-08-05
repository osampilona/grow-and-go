import { memo, useMemo } from "react";
import { Chip } from "@heroui/chip";
import { useCategoryStore } from "../stores/categoryStore";
import { categories } from "../stores/categoryStore";

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

  // Define different colors for each category
  const categoryColors = useMemo(() => {
    const colors = ["primary", "secondary", "success", "warning", "danger"];
    return categories.reduce((acc, category, index) => {
      if (category.id !== "everything") {
        acc[category.id] = colors[index % colors.length] as any;
      }
      return acc;
    }, {} as Record<string, "primary" | "secondary" | "success" | "warning" | "danger">);
  }, []);

  // Memoize the category chips to prevent unnecessary re-renders
  const categoryChips = useMemo(() => {
    // Don't show chips if "everything" is selected or no categories are selected
    if (isTempEverythingSelected || tempSelected.length === 0) {
      return null;
    }

    // Filter out "everything" from the selected categories for display
    const activeCategories = tempSelected.filter(category => category !== "everything");
    
    if (activeCategories.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {activeCategories.map((categoryId) => (
          <Chip
            key={categoryId}
            onClose={() => onClearCategory(categoryId)}
            variant="flat"
            color={categoryColors[categoryId] || "secondary"}
            size="sm"
            className="text-xs"
          >
            {categoryMap[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
          </Chip>
        ))}
      </div>
    );
  }, [tempSelected, isTempEverythingSelected, onClearCategory, categoryMap, categoryColors]);

  return categoryChips;
});
