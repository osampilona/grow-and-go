import { useMemo } from "react";
import { useFilterStore } from "../stores/filterStore";

/**
 * Custom hook to optimize filter store subscriptions and prevent unnecessary re-renders
 */
export const useFilterOptimizations = () => {
  // Subscribe only to the specific parts we need
  const gender = useFilterStore((state) => state.tempFilters.gender);
  const ageRange = useFilterStore((state) => state.tempFilters.ageRange);
  const priceRange = useFilterStore((state) => state.tempFilters.priceRange);
  const sortBy = useFilterStore((state) => state.tempFilters.sortBy);
  const inStock = useFilterStore((state) => state.tempFilters.inStock);
  const onSale = useFilterStore((state) => state.tempFilters.onSale);
  const itemCondition = useFilterStore((state) => state.tempFilters.itemCondition);
  const sellerRating = useFilterStore((state) => state.tempFilters.sellerRating);
  const locationRange = useFilterStore((state) => state.tempFilters.locationRange);

  // Return memoized optimized selectors
  return useMemo(() => ({
    gender,
    ageRange,
    priceRange,
    sortBy,
    inStock,
    onSale,
    itemCondition,
    sellerRating,
    locationRange,
    // Computed values
    genderState: {
      isBoySelected: gender.includes("Boy"),
      isGirlSelected: gender.includes("Girl")
    }
  }), [gender, ageRange, priceRange, sortBy, inStock, onSale, itemCondition, sellerRating, locationRange]);
};
