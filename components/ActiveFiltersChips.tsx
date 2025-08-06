import { memo } from "react";
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
  const tempFilters = useFilterStore((state) => state.tempFilters);

  return (
    <div className="flex flex-wrap gap-1">
      {/* 1. Gender Chips - Show separate chips for each selected gender */}
      {tempFilters.gender.map((gender) => (
        <Chip
          key={gender}
          size="sm"
          variant="flat"
          color={gender === "Girl" ? "secondary" : "primary"}
          onClose={() => {
            // Remove this specific gender from the array
            const updatedGenders = tempFilters.gender.filter(g => g !== gender);
            onClearGender(updatedGenders);
          }}
        >
          {gender}
        </Chip>
      ))}
      {/* 2. Age Range Chip - only show if NOT the full range (0-60) */}
      {(tempFilters.ageRange[0] !== 0 || tempFilters.ageRange[1] !== 60) && (
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
      {(tempFilters.priceRange[0] !== 0 || tempFilters.priceRange[1] !== 500) && (
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
      {tempFilters.sortBy !== "newest" && (
        <Chip
          size="sm"
          variant="flat"
          color="primary"
          onClose={onClearSortBy}
        >
          Sort: {tempFilters.sortBy === "oldest" && "Oldest First"}
          {tempFilters.sortBy === "price-low" && "Price Low-High"}
          {tempFilters.sortBy === "price-high" && "Price High-Low"}
          {tempFilters.sortBy === "popular" && "Most Popular"}
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
      {tempFilters.itemCondition !== "all" && (
        <Chip
          size="sm"
          variant="flat"
          color="success"
          onClose={onClearItemCondition}
        >
          {tempFilters.itemCondition === "brand-new" && "Brand New"}
          {tempFilters.itemCondition === "like-new" && "Like New"}  
          {tempFilters.itemCondition === "very-good" && "Very Good"}
          {tempFilters.itemCondition === "good" && "Good"}
          {tempFilters.itemCondition === "fair" && "Fair"}
        </Chip>
      )}
      {/* 7. Seller Rating Chip */}
      {tempFilters.sellerRating !== null && tempFilters.sellerRating > 0 && (
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
