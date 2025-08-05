import { memo } from "react";
import { Chip } from "@heroui/chip";
import { useFilterStore } from "../stores/filterStore";

interface ActiveFiltersChipsProps {
  onClearBrand: (brand: string) => void;
  onClearOnSale: () => void;
  onClearInStock: () => void;
  onClearItemCondition: () => void;
  onClearSellerRating: () => void;
  onClearAgeRange: () => void;
  onClearPriceRange: () => void;
  onClearLocationRange: () => void;
}

export const ActiveFiltersChips = memo(function ActiveFiltersChips({
  onClearBrand,
  onClearOnSale,
  onClearInStock,
  onClearItemCondition,
  onClearSellerRating,
  onClearAgeRange,
  onClearPriceRange,
  onClearLocationRange
}: ActiveFiltersChipsProps) {
  const tempFilters = useFilterStore((state) => state.tempFilters);

  return (
    <div className="flex flex-wrap gap-1">
      {/* Age Range Chip - only show if NOT the full range (0-60) */}
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
      {/* Price Range Chip - only show if NOT the full range (0-500) */}
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
      {/* Location Range Chip - only show if NOT the default range (5-25) */}
      {(tempFilters.locationRange[0] !== 5 || tempFilters.locationRange[1] !== 25) && (
        <Chip
          size="sm"
          variant="flat"
          color="success"
          onClose={onClearLocationRange}
        >
          Location: {tempFilters.locationRange[0]}-{tempFilters.locationRange[1]} km
        </Chip>
      )}
      {/* Brand Chips */}
      {tempFilters.selectedBrands.map((brand) => (
        <Chip
          key={`brand-${brand}`}
          size="sm"
          variant="flat"
          color="primary"
          onClose={() => onClearBrand(brand)}
        >
          {brand}
        </Chip>
      ))}
      {/* On Sale Chip */}
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
      {/* Include Out of Stock Chip */}
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
      {/* Item Condition Chip */}
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
      {/* Seller Rating Chip */}
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
    </div>
  );
});
