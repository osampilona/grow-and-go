import { memo } from "react";
import { Chip } from "@heroui/chip";
import { useFilterStore } from "../stores/filterStore";

interface ActiveFiltersChipsProps {
  onClearBrand: (brand: string) => void;
  onClearOnSale: () => void;
  onClearInStock: () => void;
  onClearItemCondition: () => void;
  onClearSellerRating: () => void;
}

export const ActiveFiltersChips = memo(function ActiveFiltersChips({
  onClearBrand,
  onClearOnSale,
  onClearInStock,
  onClearItemCondition,
  onClearSellerRating
}: ActiveFiltersChipsProps) {
  const tempFilters = useFilterStore((state) => state.tempFilters);

  return (
    <div className="flex flex-wrap gap-1">
      {/* Age Range Chip */}
      {(tempFilters.ageRange[0] !== 0 || tempFilters.ageRange[1] !== 36) && (
        <Chip
          size="sm"
          variant="flat"
          color="primary"
        >
          Age: {tempFilters.ageRange[0]}-{tempFilters.ageRange[1]} months
        </Chip>
      )}
      {/* Price Range Chip */}
      {(tempFilters.priceRange[0] !== 10 || tempFilters.priceRange[1] !== 200) && (
        <Chip
          size="sm"
          variant="flat"
          color="secondary"
        >
          Price: ${tempFilters.priceRange[0]}-${tempFilters.priceRange[1]}
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
      {tempFilters.sellerRating > 0 && (
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
