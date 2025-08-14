import { memo, useMemo, useCallback } from "react";
import { Chip } from "@heroui/chip";

import { useFilterStore } from "../stores/filterStore";
import { useDynamicPriceBounds } from "../utils/pricing";

import { getFilterChipProps } from "@/utils/colors";

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
  onClearLocationRange,
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
  const createGenderClearHandler = useCallback(
    (gender: string) => {
      return () => {
        const updatedGenders = tempFilters.gender.filter((g) => g !== gender);

        onClearGender(updatedGenders);
      };
    },
    [tempFilters.gender, onClearGender]
  );

  // MEMOIZED: Sort by text to prevent recalculation
  const sortByText = useMemo(() => {
    switch (tempFilters.sortBy) {
      case "oldest":
        return "Oldest First";
      case "price-low":
        return "Price Low-High";
      case "price-high":
        return "Price High-Low";
      case "popular":
        return "Most Popular";
      default:
        return "";
    }
  }, [tempFilters.sortBy]);

  // MEMOIZED: Item condition text to prevent recalculation
  const itemConditionText = useMemo(() => {
    switch (tempFilters.itemCondition) {
      case "brand-new":
        return "Brand New";
      case "like-new":
        return "Like New";
      case "very-good":
        return "Very Good";
      case "good":
        return "Good";
      case "fair":
        return "Fair";
      default:
        return "";
    }
  }, [tempFilters.itemCondition]);

  // MEMOIZED: Conditional flags to prevent recalculation
  const showAgeRange = useMemo(
    () => tempFilters.ageRange[0] !== 0 || tempFilters.ageRange[1] !== 60,
    [tempFilters.ageRange]
  );

  const { maxPrice } = useDynamicPriceBounds();
  const showPriceRange = useMemo(
    () => tempFilters.priceRange[0] !== 0 || tempFilters.priceRange[1] !== maxPrice,
    [tempFilters.priceRange, maxPrice]
  );

  const showSortBy = useMemo(() => tempFilters.sortBy !== "newest", [tempFilters.sortBy]);

  const showItemCondition = useMemo(
    () => tempFilters.itemCondition !== "all",
    [tempFilters.itemCondition]
  );

  const showSellerRating = useMemo(
    () => tempFilters.sellerRating !== null && tempFilters.sellerRating > 0,
    [tempFilters.sellerRating]
  );

  // Shipping method label mapper (memoized static)
  const shippingLabels = useMemo(
    () =>
      ({
        pickup: "Pickup",
        shipping: "Shipping",
        "local-delivery": "Local Delivery",
      }) as Record<string, string>,
    []
  );

  return (
    <div className="flex flex-wrap gap-1">
      {/* 1. Gender (Tier 1) */}
      {tempFilters.gender.map((gender) => (
        <Chip
          key={gender}
          size="sm"
          variant="flat"
          {...getFilterChipProps("gender")}
          onClose={createGenderClearHandler(gender)}
        >
          {gender}
        </Chip>
      ))}
      {/* 2. Age Range (Tier 1) */}
      {showAgeRange && (
        <Chip size="sm" variant="flat" {...getFilterChipProps("age")} onClose={onClearAgeRange}>
          Age: {tempFilters.ageRange[0]}-{tempFilters.ageRange[1]}m
        </Chip>
      )}
      {/* 3. Price Range (Tier 1) */}
      {showPriceRange && (
        <Chip size="sm" variant="flat" {...getFilterChipProps("price")} onClose={onClearPriceRange}>
          Price: DKK {tempFilters.priceRange[0]}-{tempFilters.priceRange[1]}
        </Chip>
      )}
      {/* 4. Sizes (Tier 1) */}
      {tempFilters.sizes?.map((size) => (
        <Chip
          key={`size-${size}`}
          size="sm"
          variant="flat"
          {...getFilterChipProps("size")}
          onClose={() => toggleTempSize(size)}
        >
          {size}
        </Chip>
      ))}
      {/* 5. Item Condition (Tier 2) */}
      {showItemCondition && (
        <Chip
          size="sm"
          variant="flat"
          {...getFilterChipProps("condition")}
          onClose={onClearItemCondition}
        >
          {itemConditionText}
        </Chip>
      )}
      {/* 6. Brands (Tier 2) */}
      {tempFilters.brands?.map((brand) => (
        <Chip
          key={`brand-${brand}`}
          size="sm"
          variant="flat"
          {...getFilterChipProps("brand")}
          onClose={() => toggleTempBrand(brand)}
        >
          {brand}
        </Chip>
      ))}
      {/* 7. Availability & Sales (Tier 2) */}
      {!tempFilters.inStock && (
        <Chip
          size="sm"
          variant="flat"
          {...getFilterChipProps("availability")}
          onClose={onClearInStock}
        >
          Include OOS
        </Chip>
      )}
      {tempFilters.onSale && (
        <Chip size="sm" variant="flat" {...getFilterChipProps("sale")} onClose={onClearOnSale}>
          On Sale
        </Chip>
      )}
      {/* 8. Delivery Methods (Tier 3) */}
      {tempFilters.shippingMethods?.map((method) => (
        <Chip
          key={`ship-${method}`}
          size="sm"
          variant="flat"
          {...getFilterChipProps("shipping")}
          onClose={() => toggleTempShippingMethod(method)}
        >
          {shippingLabels[method] || method}
        </Chip>
      ))}
      {/* 9. Location Range (Tier 3) */}
      {tempFilters.isLocationRangeSet && (
        <Chip
          size="sm"
          variant="flat"
          {...getFilterChipProps("location")}
          onClose={onClearLocationRange}
        >
          Location: {tempFilters.locationRange} km
        </Chip>
      )}
      {/* 10. Seller Rating (Tier 3) */}
      {showSellerRating && (
        <Chip
          size="sm"
          variant="flat"
          {...getFilterChipProps("rating")}
          onClose={onClearSellerRating}
        >
          {tempFilters.sellerRating}+ Stars
        </Chip>
      )}
      {/* 11. Environment & Hygiene (Tier 4) */}
      {tempFilters.petFree && (
        <Chip
          size="sm"
          variant="flat"
          {...getFilterChipProps("environment")}
          onClose={toggleTempPetFree}
        >
          Pet Free
        </Chip>
      )}
      {tempFilters.smokeFree && (
        <Chip
          size="sm"
          variant="flat"
          {...getFilterChipProps("environment")}
          onClose={toggleTempSmokeFree}
        >
          Smoke Free
        </Chip>
      )}
      {tempFilters.perfumeFree && (
        <Chip
          size="sm"
          variant="flat"
          {...getFilterChipProps("environment")}
          onClose={toggleTempPerfumeFree}
        >
          Perfume Free
        </Chip>
      )}
      {/* 12. Deals (Tier 4) */}
      {tempFilters.bundleDeal && (
        <Chip
          size="sm"
          variant="flat"
          {...getFilterChipProps("deal")}
          onClose={toggleTempBundleDeal}
        >
          Bundle Deal
        </Chip>
      )}
      {/* 13. Sort By (Tier 4) */}
      {showSortBy && (
        <Chip size="sm" variant="flat" {...getFilterChipProps("sort")} onClose={onClearSortBy}>
          Sort: {sortByText}
        </Chip>
      )}
    </div>
  );
});
