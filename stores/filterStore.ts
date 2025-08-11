import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FilterState {
  gender: string[]; // Changed to array to support multiple gender selection
  ageRange: number[];
  priceRange: number[];
  locationRange: number; // Single value for maximum distance in km
  sortBy: string;
  inStock: boolean;
  onSale: boolean;
  itemCondition: string; // New field for item condition
  sellerRating: number | null; // New field for minimum seller rating (null = no filter)
  isLocationRangeSet: boolean; // Track if user has actively set location range
  // New extended filters
  sizes: string[]; // clothing sizes
  brands: string[]; // selected brands
  petFree: boolean; // pet-free home
  smokeFree: boolean; // smoke-free home
  perfumeFree: boolean; // perfume-free (fragrance free) environment
  shippingMethods: string[]; // e.g., pickup, shipping, local-delivery
  bundleDeal: boolean; // bundle deals available
}

interface FilterStore {
  // Applied filters (the main state)
  filters: FilterState;
  
  // Temporary filters (for editing in modal/drawer before applying)
  tempFilters: FilterState;
  
  // UI state
  isFiltersModalOpen: boolean;
  isFiltersSelected: boolean;
  
  // Actions for main filters
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  
  // Actions for temporary filters
  setTempFilters: (filters: FilterState) => void;
  resetTempFilters: () => void;
  initializeTempFilters: () => void;
  
  // Individual temp filter actions
  setTempGender: (gender: string[]) => void;
  toggleTempGender: (gender: string) => void;
  setTempAgeRange: (range: number[]) => void;
  setTempPriceRange: (range: number[]) => void;
  setTempLocationRange: (range: number) => void;
  setTempSortBy: (sortBy: string) => void;
  setTempInStock: (inStock: boolean) => void;
  setTempOnSale: (onSale: boolean) => void;
  setTempItemCondition: (condition: string) => void;
  setTempSellerRating: (rating: number | null) => void;
  // New setters / togglers
  setTempSizes: (sizes: string[]) => void;
  toggleTempSize: (size: string) => void;
  setTempBrands: (brands: string[]) => void;
  toggleTempBrand: (brand: string) => void;
  setTempPetFree: (petFree: boolean) => void;
  toggleTempPetFree: () => void;
  setTempSmokeFree: (smokeFree: boolean) => void;
  toggleTempSmokeFree: () => void;
  setTempPerfumeFree: (perfumeFree: boolean) => void;
  toggleTempPerfumeFree: () => void;
  setTempShippingMethods: (methods: string[]) => void;
  toggleTempShippingMethod: (method: string) => void;
  setTempBundleDeal: (bundleDeal: boolean) => void;
  toggleTempBundleDeal: () => void;
  
  // Individual temp filter clearing actions
  clearTempGender: () => void;
  clearTempOnSale: () => void;
  clearTempInStock: () => void;
  clearTempItemCondition: () => void;
  clearTempSellerRating: () => void;
  clearTempSortBy: () => void;
  clearTempAgeRange: () => void;
  clearTempPriceRange: () => void;
  clearTempLocationRange: () => void;
  clearTempSizes: () => void;
  clearTempBrands: () => void;
  clearTempPetFree: () => void;
  clearTempSmokeFree: () => void;
  clearTempPerfumeFree: () => void;
  clearTempShippingMethods: () => void;
  clearTempBundleDeal: () => void;
  clearAllTempFilters: () => void;
  
  // Apply/Cancel actions
  applyFilters: () => void;
  cancelFilters: () => void;
  
  // UI state actions
  setFiltersModalOpen: (isOpen: boolean) => void;
  setFiltersSelected: (isSelected: boolean) => void;
  
  // Helper functions
  hasActiveFilters: () => boolean;
  hasTempActiveFilters: () => boolean;
  getFilterCount: () => number;
  getTempFilterCount: () => number;
}

// Base (frozen) default state object. Never mutate; always clone when assigning to store.
export const defaultFilterState: FilterState = Object.freeze({
  gender: [], // Default to empty array (show all genders)
  ageRange: [0, 60],
  priceRange: [0, 500],
  locationRange: 25, // Default to 25 km maximum distance
  sortBy: "newest",
  inStock: true, // Default to show only in-stock items
  onSale: false,
  itemCondition: "all",
  sellerRating: null, // No rating filter by default
  isLocationRangeSet: false, // Default to false - user hasn't set it yet
  sizes: [],
  brands: [],
  petFree: false,
  smokeFree: false,
  perfumeFree: false,
  shippingMethods: [],
  bundleDeal: false,
});

// Creates a fresh, shallow-cloned default state to ensure new object / array references.
const cloneFilterState = (): FilterState => ({
  ...defaultFilterState,
  gender: [...defaultFilterState.gender],
  ageRange: [...defaultFilterState.ageRange],
  priceRange: [...defaultFilterState.priceRange],
  sizes: [...defaultFilterState.sizes],
  brands: [...defaultFilterState.brands],
  shippingMethods: [...defaultFilterState.shippingMethods],
});

// Helper utilities to keep active / count logic DRY & consistent.
const isFiltersActive = (fs: FilterState): boolean => {
  return (fs.gender?.length ?? 0) > 0 ||
    (fs.sizes?.length ?? 0) > 0 ||
    (fs.brands?.length ?? 0) > 0 ||
    (fs.shippingMethods?.length ?? 0) > 0 ||
    fs.onSale !== defaultFilterState.onSale ||
    fs.inStock !== defaultFilterState.inStock ||
    fs.itemCondition !== defaultFilterState.itemCondition ||
    (fs.sellerRating !== null && fs.sellerRating > 0) ||
    (fs.ageRange[0] !== defaultFilterState.ageRange[0] || fs.ageRange[1] !== defaultFilterState.ageRange[1]) ||
    (fs.priceRange[0] !== defaultFilterState.priceRange[0] || fs.priceRange[1] !== defaultFilterState.priceRange[1]) ||
    fs.isLocationRangeSet ||
    fs.petFree !== defaultFilterState.petFree ||
    fs.smokeFree !== defaultFilterState.smokeFree ||
    fs.perfumeFree !== defaultFilterState.perfumeFree ||
    fs.bundleDeal !== defaultFilterState.bundleDeal ||
    fs.sortBy !== defaultFilterState.sortBy;
};

const countActiveFilters = (fs: FilterState): number => {
  let count = 0;
  if ((fs.gender?.length ?? 0) > 0) count++;
  if ((fs.sizes?.length ?? 0) > 0) count++;
  if ((fs.brands?.length ?? 0) > 0) count++;
  if ((fs.shippingMethods?.length ?? 0) > 0) count++;
  if (fs.onSale !== defaultFilterState.onSale) count++;
  if (fs.inStock !== defaultFilterState.inStock) count++;
  if (fs.itemCondition !== defaultFilterState.itemCondition) count++;
  if (fs.sellerRating !== null && fs.sellerRating > 0) count++;
  if (fs.ageRange[0] !== defaultFilterState.ageRange[0] || fs.ageRange[1] !== defaultFilterState.ageRange[1]) count++;
  if (fs.priceRange[0] !== defaultFilterState.priceRange[0] || fs.priceRange[1] !== defaultFilterState.priceRange[1]) count++;
  if (fs.isLocationRangeSet) count++;
  if (fs.petFree !== defaultFilterState.petFree) count++;
  if (fs.smokeFree !== defaultFilterState.smokeFree) count++;
  if (fs.perfumeFree !== defaultFilterState.perfumeFree) count++;
  if (fs.bundleDeal !== defaultFilterState.bundleDeal) count++;
  if (fs.sortBy !== defaultFilterState.sortBy) count++;
  return count;
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      // Initial state
  // Always use fresh clones so that resetting to defaults still triggers subscribers.
  filters: cloneFilterState(),
  tempFilters: cloneFilterState(),
      isFiltersModalOpen: false,
      isFiltersSelected: false,
      
      // Actions for main filters
      setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: cloneFilterState() }),
      
      // Actions for temporary filters
      setTempFilters: (tempFilters) => set({ tempFilters }),
      resetTempFilters: () => {
        const { filters } = get();
        // Ensure new reference copies for arrays
        set({ tempFilters: { ...filters, gender: [...filters.gender], ageRange: [...filters.ageRange], priceRange: [...filters.priceRange], sizes: [...filters.sizes], brands: [...filters.brands], shippingMethods: [...filters.shippingMethods] } });
      },
      initializeTempFilters: () => {
        const { filters } = get();
        set({ tempFilters: { ...filters, gender: [...filters.gender], ageRange: [...filters.ageRange], priceRange: [...filters.priceRange], sizes: [...filters.sizes], brands: [...filters.brands], shippingMethods: [...filters.shippingMethods] } });
      },
      
      // Individual temp filter actions
      setTempGender: (gender) => set((state) => ({
        tempFilters: { ...state.tempFilters, gender }
      })),
      toggleTempGender: (gender) => set((state) => {
        const currentGenders = state.tempFilters.gender;
        const isSelected = currentGenders.includes(gender);
        
        if (isSelected) {
          // Remove gender if already selected
          return {
            tempFilters: { 
              ...state.tempFilters, 
              gender: currentGenders.filter(g => g !== gender) 
            }
          };
        } else {
          // Add gender if not selected
          return {
            tempFilters: { 
              ...state.tempFilters, 
              gender: [...currentGenders, gender] 
            }
          };
        }
      }),
      setTempAgeRange: (ageRange) => set((state) => ({
        tempFilters: { ...state.tempFilters, ageRange }
      })),
      setTempPriceRange: (priceRange) => set((state) => ({
        tempFilters: { ...state.tempFilters, priceRange }
      })),
      setTempLocationRange: (locationRange) => set((state) => ({
        tempFilters: { ...state.tempFilters, locationRange, isLocationRangeSet: true }
      })),
      setTempSortBy: (sortBy) => set((state) => ({
        tempFilters: { ...state.tempFilters, sortBy }
      })),
      setTempInStock: (inStock) => set((state) => ({
        tempFilters: { ...state.tempFilters, inStock }
      })),
      setTempOnSale: (onSale) => set((state) => ({
        tempFilters: { ...state.tempFilters, onSale }
      })),
      setTempItemCondition: (itemCondition) => set((state) => ({
        tempFilters: { ...state.tempFilters, itemCondition }
      })),
      setTempSellerRating: (sellerRating) => set((state) => ({
        tempFilters: { ...state.tempFilters, sellerRating }
      })),
      setTempSizes: (sizes) => set((state) => ({
        tempFilters: { ...state.tempFilters, sizes }
      })),
      toggleTempSize: (size) => set((state) => {
        const current = state.tempFilters.sizes;
        return { tempFilters: { ...state.tempFilters, sizes: current.includes(size) ? current.filter(s => s !== size) : [...current, size] } };
      }),
      setTempBrands: (brands) => set((state) => ({
        tempFilters: { ...state.tempFilters, brands }
      })),
      toggleTempBrand: (brand) => set((state) => {
        const current = state.tempFilters.brands;
        return { tempFilters: { ...state.tempFilters, brands: current.includes(brand) ? current.filter(b => b !== brand) : [...current, brand] } };
      }),
      setTempPetFree: (petFree) => set((state) => ({
        tempFilters: { ...state.tempFilters, petFree }
      })),
      toggleTempPetFree: () => set((state) => ({
        tempFilters: { ...state.tempFilters, petFree: !state.tempFilters.petFree }
      })),
      setTempSmokeFree: (smokeFree) => set((state) => ({
        tempFilters: { ...state.tempFilters, smokeFree }
      })),
      toggleTempSmokeFree: () => set((state) => ({
        tempFilters: { ...state.tempFilters, smokeFree: !state.tempFilters.smokeFree }
      })),
      setTempPerfumeFree: (perfumeFree) => set((state) => ({
        tempFilters: { ...state.tempFilters, perfumeFree }
      })),
      toggleTempPerfumeFree: () => set((state) => ({
        tempFilters: { ...state.tempFilters, perfumeFree: !state.tempFilters.perfumeFree }
      })),
      setTempShippingMethods: (shippingMethods) => set((state) => ({
        tempFilters: { ...state.tempFilters, shippingMethods }
      })),
      toggleTempShippingMethod: (method) => set((state) => {
        const current = state.tempFilters.shippingMethods;
        return { tempFilters: { ...state.tempFilters, shippingMethods: current.includes(method) ? current.filter(m => m !== method) : [...current, method] } };
      }),
      setTempBundleDeal: (bundleDeal) => set((state) => ({
        tempFilters: { ...state.tempFilters, bundleDeal }
      })),
      toggleTempBundleDeal: () => set((state) => ({
        tempFilters: { ...state.tempFilters, bundleDeal: !state.tempFilters.bundleDeal }
      })),
      
      // Individual temp filter clearing actions
      clearTempGender: () => set((state) => ({
        tempFilters: { ...state.tempFilters, gender: [] }
      })),
      clearTempOnSale: () => set((state) => ({
        tempFilters: { ...state.tempFilters, onSale: false }
      })),
      clearTempInStock: () => set((state) => ({
        tempFilters: { ...state.tempFilters, inStock: true }
      })),
      clearTempItemCondition: () => set((state) => ({
        tempFilters: { ...state.tempFilters, itemCondition: "all" }
      })),
      clearTempSellerRating: () => set((state) => ({
        tempFilters: { ...state.tempFilters, sellerRating: null }
      })),
      clearTempSortBy: () => set((state) => ({
        tempFilters: { ...state.tempFilters, sortBy: "newest" }
      })),
      clearTempAgeRange: () => set((state) => ({
        tempFilters: { ...state.tempFilters, ageRange: [0, 60] }
      })),
      clearTempPriceRange: () => set((state) => ({
        tempFilters: { ...state.tempFilters, priceRange: [0, 500] }
      })),
      clearTempLocationRange: () => set((state) => ({
        tempFilters: { ...state.tempFilters, locationRange: 25, isLocationRangeSet: false }
      })),
      clearTempSizes: () => set((state) => ({
        tempFilters: { ...state.tempFilters, sizes: [] }
      })),
      clearTempBrands: () => set((state) => ({
        tempFilters: { ...state.tempFilters, brands: [] }
      })),
      clearTempPetFree: () => set((state) => ({
        tempFilters: { ...state.tempFilters, petFree: false }
      })),
      clearTempSmokeFree: () => set((state) => ({
        tempFilters: { ...state.tempFilters, smokeFree: false }
      })),
      clearTempPerfumeFree: () => set((state) => ({
        tempFilters: { ...state.tempFilters, perfumeFree: false }
      })),
      clearTempShippingMethods: () => set((state) => ({
        tempFilters: { ...state.tempFilters, shippingMethods: [] }
      })),
      clearTempBundleDeal: () => set((state) => ({
        tempFilters: { ...state.tempFilters, bundleDeal: false }
      })),
  clearAllTempFilters: () => set({ tempFilters: cloneFilterState() }),
      
      // Apply/Cancel actions
      applyFilters: () => {
        const { tempFilters } = get();
        set({ 
          filters: { ...tempFilters },
          isFiltersSelected: false 
        });
      },
      cancelFilters: () => {
        const { filters } = get();
        set({ 
          tempFilters: { ...filters },
          isFiltersSelected: false 
        });
      },
      
      // UI state actions
      setFiltersModalOpen: (isFiltersModalOpen) => set({ isFiltersModalOpen }),
      setFiltersSelected: (isFiltersSelected) => set({ isFiltersSelected }),
      
      // Helper functions
  hasActiveFilters: () => isFiltersActive(get().filters),
  hasTempActiveFilters: () => isFiltersActive(get().tempFilters),
  getFilterCount: () => countActiveFilters(get().filters),
  getTempFilterCount: () => countActiveFilters(get().tempFilters)
    }),
    {
      name: 'filter-store',
      // Only persist the main filters, not the temp state or UI state
      partialize: (state) => ({ filters: state.filters })
    }
  )
);
