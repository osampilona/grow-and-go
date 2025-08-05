import { memo } from "react";
import { Button } from "@heroui/button";
import { CloseIcon } from "./icons";
import { ActiveFiltersChips } from "./ActiveFiltersChips";
import { ActiveCategoryChips } from "./ActiveCategoryChips";
import { useCategoryStore } from "../stores/categoryStore";
import { useFilterStore } from "../stores/filterStore";

interface FiltersHeaderProps {
  title: string;
  onClose: () => void;
  showResetAll?: boolean;
  onResetAll?: () => void;
  // Show category chips (only for mobile drawer)
  showCategoryChips?: boolean;
  onClearCategory?: (category: string) => void;
  // Clear handlers for ActiveFiltersChips
  onClearBrand: (brand: string) => void;
  onClearOnSale: () => void;
  onClearInStock: () => void;
  onClearItemCondition: () => void;
  onClearSellerRating: () => void;
  onClearSortBy: () => void;
  onClearAgeRange: () => void;
  onClearPriceRange: () => void;
  onClearLocationRange: () => void;
}

export const FiltersHeader = memo(function FiltersHeader({
  title,
  onClose,
  showResetAll = false,
  onResetAll,
  showCategoryChips = false,
  onClearCategory,
  onClearBrand,
  onClearOnSale,
  onClearInStock,
  onClearItemCondition,
  onClearSellerRating,
  onClearSortBy,
  onClearAgeRange,
  onClearPriceRange,
  onClearLocationRange
}: FiltersHeaderProps) {
  // Check if there are active categories (excluding "everything")
  const tempSelected = useCategoryStore((state) => state.tempSelected);
  const isTempEverythingSelected = useCategoryStore((state) => state.isTempSelected("everything"));
  const hasActiveCategories = showCategoryChips && !isTempEverythingSelected && 
    tempSelected.length > 0 && 
    tempSelected.filter(cat => cat !== "everything").length > 0;

  // Check if there are active filters
  const hasTempActiveFilters = useFilterStore((state) => state.hasTempActiveFilters());

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          {showResetAll && onResetAll && (
            <Button
              size="sm"
              variant="flat"
              color="warning"
              onPress={onResetAll}
              className="text-xs"
            >
              Reset All
            </Button>
          )}
          <Button
            isIconOnly
            className="text-foreground-500"
            radius="full"
            variant="light"
            onPress={onClose}
          >
            <CloseIcon />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {/* Category Chips - Only show for mobile drawer */}
        {showCategoryChips && onClearCategory && hasActiveCategories && (
          <div>
            <h4 className="text-xs font-medium text-foreground-500 mb-2">Active Categories</h4>
            <ActiveCategoryChips onClearCategory={onClearCategory} />
          </div>
        )}
        
        {/* Filter Chips */}
        {hasTempActiveFilters && (
          <div>
            <h4 className="text-xs font-medium text-foreground-500 mb-2">Active Filters</h4>
            <ActiveFiltersChips
              onClearBrand={onClearBrand}
              onClearOnSale={onClearOnSale}
              onClearInStock={onClearInStock}
              onClearItemCondition={onClearItemCondition}
              onClearSellerRating={onClearSellerRating}
              onClearSortBy={onClearSortBy}
              onClearAgeRange={onClearAgeRange}
              onClearPriceRange={onClearPriceRange}
              onClearLocationRange={onClearLocationRange}
            />
          </div>
        )}
      </div>
    </div>
  );
});
