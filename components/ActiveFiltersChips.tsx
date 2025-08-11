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
  // New toggle actions for extended filters
  const toggleTempSize = useFilterStore((state) => state.toggleTempSize);
  const toggleTempBrand = useFilterStore((state) => state.toggleTempBrand);
  const toggleTempPetFree = useFilterStore((state) => state.toggleTempPetFree);
  const toggleTempSmokeFree = useFilterStore((state) => state.toggleTempSmokeFree);
  const toggleTempPerfumeFree = useFilterStore((state) => state.toggleTempPerfumeFree);
  const toggleTempShippingMethod = useFilterStore((state) => state.toggleTempShippingMethod);
  const toggleTempBundleDeal = useFilterStore((state) => state.toggleTempBundleDeal);

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

  // Shipping method label mapper (memoized static)
  const shippingLabels = useMemo(() => ({
    'pickup': 'Pickup',
    'shipping': 'Shipping',
    'local-delivery': 'Local Delivery'
  } as Record<string,string>), []);

  return (
    <div className="flex flex-wrap gap-1">
      {/* 1. Gender */}
      {tempFilters.gender.map((gender) => (
        <Chip
          key={gender}
          size="sm"
          variant="flat"
          color={gender === "Girl" ? "secondary" : "primary"}
          onClose={createGenderClearHandler(gender)}
        >{gender}</Chip>
      ))}
      {/* 2. Age Range */}
      {showAgeRange && (
        <Chip size="sm" variant="flat" color="primary" onClose={onClearAgeRange}>
          Age: {tempFilters.ageRange[0]}-{tempFilters.ageRange[1]}m
        </Chip>
      )}
      {/* 3. Price Range */}
      {showPriceRange && (
        <Chip size="sm" variant="flat" color="secondary" onClose={onClearPriceRange}>
          Price: ${tempFilters.priceRange[0]}-{tempFilters.priceRange[1]}
        </Chip>
      )}
      {/* 4. Sort By */}
      {showSortBy && (
        <Chip size="sm" variant="flat" color="primary" onClose={onClearSortBy}>
          Sort: {sortByText}
        </Chip>
      )}
      {/* 5. Availability & Sales */}
      {!tempFilters.inStock && (
        <Chip size="sm" variant="flat" color="default" onClose={onClearInStock}>
          Include OOS
        </Chip>
      )}
      {tempFilters.onSale && (
        <Chip size="sm" variant="flat" color="warning" onClose={onClearOnSale}>
          On Sale
        </Chip>
      )}
      {/* 6. Item Condition */}
      {showItemCondition && (
        <Chip size="sm" variant="flat" color="success" onClose={onClearItemCondition}>
          {itemConditionText}
        </Chip>
      )}
      {/* 7. Sizes */}
      {tempFilters.sizes?.map(size => (
        <Chip key={`size-${size}`} size="sm" variant="flat" color="primary" onClose={() => toggleTempSize(size)}>{size}</Chip>
      ))}
      {/* 8. Brands */}
      {tempFilters.brands?.map(brand => (
        <Chip key={`brand-${brand}`} size="sm" variant="flat" color="secondary" onClose={() => toggleTempBrand(brand)}>{brand}</Chip>
      ))}
      {/* 9. Environment & Hygiene */}
      {tempFilters.petFree && (<Chip size="sm" variant="flat" color="success" onClose={toggleTempPetFree}>Pet Free</Chip>)}
      {tempFilters.smokeFree && (<Chip size="sm" variant="flat" color="success" onClose={toggleTempSmokeFree}>Smoke Free</Chip>)}
      {tempFilters.perfumeFree && (<Chip size="sm" variant="flat" color="success" onClose={toggleTempPerfumeFree}>Perfume Free</Chip>)}
      {/* 10. Delivery Methods */}
      {tempFilters.shippingMethods?.map(method => (
        <Chip key={`ship-${method}`} size="sm" variant="flat" color="warning" onClose={() => toggleTempShippingMethod(method)}>{shippingLabels[method] || method}</Chip>
      ))}
      {/* 11. Deals */}
      {tempFilters.bundleDeal && (<Chip size="sm" variant="flat" color="secondary" onClose={toggleTempBundleDeal}>Bundle Deal</Chip>)}
      {/* 12. Seller Rating */}
      {showSellerRating && (
        <Chip size="sm" variant="flat" color="warning" onClose={onClearSellerRating}>
          {tempFilters.sellerRating}+ Stars
        </Chip>
      )}
      {/* 13. Location Range */}
      {tempFilters.isLocationRangeSet && (
        <Chip size="sm" variant="flat" color="warning" onClose={onClearLocationRange}>
          Location: {tempFilters.locationRange} km
        </Chip>
      )}
    </div>
  );
});
