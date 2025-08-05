import { memo } from "react";
import { Button } from "@heroui/button";
import { CloseIcon } from "./icons";
import { ActiveFiltersChips } from "./ActiveFiltersChips";

interface FiltersHeaderProps {
  title: string;
  onClose: () => void;
  showResetAll?: boolean;
  onResetAll?: () => void;
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
  );
});
