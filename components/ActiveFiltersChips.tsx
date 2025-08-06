import { memo, useMemo, useCallback } from "react";
import { Chip } from "@heroui/chip";
import { useFilterStore } from "../stores/filterStore";

interface ActiveFiltersChipsProps {
  onClearGender: (gendersToKeep?: string[]) => void;
  onClearOnSale: () => void;
  onClearInStock: () => void;
  onClearItemCondition: () => void;
  onClearSellerRating: () => void;
  onClearSortBy: () => void;
  onClearAgeRange: () => void;
  onClearPriceRange: () => void;
  onClearLocationRange: () => void;
}

export const ActiveFiltersChips = memo(function ActiveFiltersChips({
  onClearGender,
  onClearOnSale,
  onClearInStock,
  onClearItemCondition,
  onClearSellerRating,
  onClearSortBy,
  onClearAgeRange,
  onClearPriceRange,
  onClearLocationRange
}: ActiveFiltersChipsProps) {
  // Optimize store subscription - only get what we need
  const tempFilters = useFilterStore((state) => state.tempFilters);

  // MEMOIZED: Gender chip handler to prevent recreation
  const createGenderClearHandler = useCallback((gender: string) => {
    return () => {
      const updatedGenders = tempFilters.gender.filter(g => g !== gender);
      onClearGender(updatedGenders);
    };
  }, [tempFilters.gender, onClearGender]);

  // MEMOIZED: Sort by text to prevent recalculation
  const sortByText = useMemo(() => {
    switch (tempFilters.sortBy) {
      case "oldest": return "Oldest First";
      case "price-low": return "Price Low-High";
      case "price-high": return "Price High-Low";
      case "popular": return "Most Popular";
      default: return "";
    }
  }, [tempFilters.sortBy]);

  // MEMOIZED: Item condition text to prevent recalculation
  const itemConditionText = useMemo(() => {
    switch (tempFilters.itemCondition) {
      case "brand-new": return "Brand New";
      case "like-new": return "Like New";
      case "very-good": return "Very Good";
      case "good": return "Good";
      case "fair": return "Fair";
      default: return "";
    }
  }, [tempFilters.itemCondition]);

  // MEMOIZED: Conditional flags to prevent recalculation
  const showAgeRange = useMemo(() => 
    tempFilters.ageRange[0] !== 0 || tempFilters.ageRange[1] !== 60,
    [tempFilters.ageRange]
  );

  const showPriceRange = useMemo(() => 
    tempFilters.priceRange[0] !== 0 || tempFilters.priceRange[1] !== 500,
    [tempFilters.priceRange]
  );

  const showSortBy = useMemo(() => 
    tempFilters.sortBy !== "newest",
    [tempFilters.sortBy]
  );

  const showItemCondition = useMemo(() => 
    tempFilters.itemCondition !== "all",
    [tempFilters.itemCondition]
  );

  const showSellerRating = useMemo(() => 
    tempFilters.sellerRating !== null && tempFilters.sellerRating > 0,
    [tempFilters.sellerRating]
  );

  return (
    <div className="flex flex-wrap gap-1">
      {/* 1. Gender Chips - Show separate chips for each selected gender */}
      {tempFilters.gender.map((gender) => (
        <Chip
          key={gender}
          size="sm"
          variant="flat"
          color={gender === "Girl" ? "secondary" : "primary"}
          onClose={createGenderClearHandler(gender)}
        >
          {gender}
        </Chip>
      ))}
      
      {/* 2. Age Range Chip - only show if NOT the full range (0-60) */}
      {showAgeRange && (
        <Chip
          size="sm"
          variant="flat"
          color="primary"
          onClose={onClearAgeRange}
        >
          Age: {tempFilters.ageRange[0]}-{tempFilters.ageRange[1]} months
        </Chip>
      )}
      
      {/* 3. Price Range Chip - only show if NOT the full range (0-500) */}
      {showPriceRange && (
        <Chip
          size="sm"
          variant="flat"
          color="secondary"
          onClose={onClearPriceRange}
        >
          Price: ${tempFilters.priceRange[0]}-${tempFilters.priceRange[1]}
        </Chip>
      )}
      
      {/* 4. Sort By Chip */}
      {showSortBy && (
        <Chip
          size="sm"
          variant="flat"
          color="primary"
          onClose={onClearSortBy}
        >
          Sort: {sortByText}
        </Chip>
      )}
      
      {/* 5. Availability & Sales - Include Out of Stock Chip */}
      {!tempFilters.inStock && (
        <Chip
          size="sm"
          variant="flat"
          color="default"
          onClose={onClearInStock}
        >
          Include Out of Stock
        </Chip>
      )}
      
      {/* 5. Availability & Sales - On Sale Chip */}
      {tempFilters.onSale && (
        <Chip
          size="sm"
          variant="flat"
          color="warning"
          onClose={onClearOnSale}
        >
          On Sale
        </Chip>
      )}
      
      {/* 6. Item Condition Chip */}
      {showItemCondition && (
        <Chip
          size="sm"
          variant="flat"
          color="success"
          onClose={onClearItemCondition}
        >
          {itemConditionText}
        </Chip>
      )}
      
      {/* 7. Seller Rating Chip */}
      {showSellerRating && (
        <Chip
          size="sm"
          variant="flat"
          color="warning"
          onClose={onClearSellerRating}
        >
          {tempFilters.sellerRating}+ Stars
        </Chip>
      )}
      
      {/* 8. Location Range Chip - show if user has actively set it */}
      {tempFilters.isLocationRangeSet && (
        <Chip
          size="sm"
          variant="flat"
          color="warning"
          onClose={onClearLocationRange}
        >
          Location: {tempFilters.locationRange} km
        </Chip>
      )}
    </div>
  );
});
