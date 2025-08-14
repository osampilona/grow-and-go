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
  const sizes = useFilterStore((state) => state.tempFilters.sizes);
  const brands = useFilterStore((state) => state.tempFilters.brands);
  const petFree = useFilterStore((state) => state.tempFilters.petFree);
  const smokeFree = useFilterStore((state) => state.tempFilters.smokeFree);
  const perfumeFree = useFilterStore((state) => state.tempFilters.perfumeFree);
  const shippingMethods = useFilterStore((state) => state.tempFilters.shippingMethods);
  const bundleDeal = useFilterStore((state) => state.tempFilters.bundleDeal);

  // Return memoized optimized selectors
  return useMemo(
    () => ({
      gender,
      ageRange,
      priceRange,
      sortBy,
      inStock,
      onSale,
      itemCondition,
      sellerRating,
      locationRange,
      sizes,
      brands,
      petFree,
      smokeFree,
      perfumeFree,
      shippingMethods,
      bundleDeal,
      // Computed values
      genderState: {
        isBoySelected: gender.includes("Boy"),
        isGirlSelected: gender.includes("Girl"),
      },
    }),
    [
      gender,
      ageRange,
      priceRange,
      sortBy,
      inStock,
      onSale,
      itemCondition,
      sellerRating,
      locationRange,
      sizes,
      brands,
      petFree,
      smokeFree,
      perfumeFree,
      shippingMethods,
      bundleDeal,
    ]
  );
};
