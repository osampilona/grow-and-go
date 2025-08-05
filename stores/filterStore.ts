import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FilterState {
  ageRange: number[];
  priceRange: number[];
  locationRange: number[]; // New field for location range in km
  selectedBrands: string[];
  sortBy: string;
  inStock: boolean;
  onSale: boolean;
  itemCondition: string; // New field for item condition
  sellerRating: number | null; // New field for minimum seller rating (null = no filter)
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
  setTempAgeRange: (range: number[]) => void;
  setTempPriceRange: (range: number[]) => void;
  setTempLocationRange: (range: number[]) => void;
  setTempSelectedBrands: (brands: string[]) => void;
  setTempSortBy: (sortBy: string) => void;
  setTempInStock: (inStock: boolean) => void;
  setTempOnSale: (onSale: boolean) => void;
  setTempItemCondition: (condition: string) => void;
  setTempSellerRating: (rating: number | null) => void;
  
  // Individual temp filter clearing actions
  clearTempBrand: (brand: string) => void;
  clearTempOnSale: () => void;
  clearTempInStock: () => void;
  clearTempItemCondition: () => void;
  clearTempSellerRating: () => void;
  clearTempAgeRange: () => void;
  clearTempPriceRange: () => void;
  clearTempLocationRange: () => void;
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

export const defaultFilterState: FilterState = {
  ageRange: [0, 60],
  priceRange: [0, 500],
  locationRange: [5, 25], // Default to 5-25 km range
  selectedBrands: [],
  sortBy: "newest",
  inStock: true, // Default to show only in-stock items
  onSale: false,
  itemCondition: "all",
  sellerRating: null, // No rating filter by default
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      // Initial state
      filters: defaultFilterState,
      tempFilters: defaultFilterState,
      isFiltersModalOpen: false,
      isFiltersSelected: false,
      
      // Actions for main filters
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: defaultFilterState }),
      
      // Actions for temporary filters
      setTempFilters: (tempFilters) => set({ tempFilters }),
      resetTempFilters: () => {
        const { filters } = get();
        set({ tempFilters: { ...filters } });
      },
      initializeTempFilters: () => {
        const { filters } = get();
        set({ tempFilters: { ...filters } });
      },
      
      // Individual temp filter actions
      setTempAgeRange: (ageRange) => set((state) => ({
        tempFilters: { ...state.tempFilters, ageRange }
      })),
      setTempPriceRange: (priceRange) => set((state) => ({
        tempFilters: { ...state.tempFilters, priceRange }
      })),
      setTempLocationRange: (locationRange) => set((state) => ({
        tempFilters: { ...state.tempFilters, locationRange }
      })),
      setTempSelectedBrands: (selectedBrands) => set((state) => ({
        tempFilters: { ...state.tempFilters, selectedBrands }
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
      
      // Individual temp filter clearing actions
      clearTempBrand: (brand) => set((state) => ({
        tempFilters: {
          ...state.tempFilters,
          selectedBrands: state.tempFilters.selectedBrands.filter(b => b !== brand)
        }
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
      clearTempAgeRange: () => set((state) => ({
        tempFilters: { ...state.tempFilters, ageRange: [0, 60] }
      })),
      clearTempPriceRange: () => set((state) => ({
        tempFilters: { ...state.tempFilters, priceRange: [0, 500] }
      })),
      clearTempLocationRange: () => set((state) => ({
        tempFilters: { ...state.tempFilters, locationRange: [5, 25] }
      })),
      clearAllTempFilters: () => set({ tempFilters: defaultFilterState }),
      
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
      hasActiveFilters: () => {
        const { filters } = get();
        return filters.selectedBrands.length > 0 || 
               filters.onSale !== defaultFilterState.onSale || 
               filters.inStock !== defaultFilterState.inStock ||
               filters.itemCondition !== defaultFilterState.itemCondition ||
               (filters.sellerRating !== null && filters.sellerRating > 0) ||
               // Only count age range as active if it's NOT the full range (0-60)
               (filters.ageRange[0] !== 0 || filters.ageRange[1] !== 60) ||
               // Only count price range as active if it's NOT the full range (0-500)
               (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500) ||
               filters.locationRange[0] !== defaultFilterState.locationRange[0] || 
               filters.locationRange[1] !== defaultFilterState.locationRange[1] ||
               filters.sortBy !== defaultFilterState.sortBy;
      },
      
      hasTempActiveFilters: () => {
        const { tempFilters } = get();
        return tempFilters.selectedBrands.length > 0 || 
               tempFilters.onSale !== defaultFilterState.onSale || 
               tempFilters.inStock !== defaultFilterState.inStock ||
               tempFilters.itemCondition !== defaultFilterState.itemCondition ||
               (tempFilters.sellerRating !== null && tempFilters.sellerRating > 0) ||
               // Only count age range as active if it's NOT the full range (0-60)
               (tempFilters.ageRange[0] !== 0 || tempFilters.ageRange[1] !== 60) ||
               // Only count price range as active if it's NOT the full range (0-500)
               (tempFilters.priceRange[0] !== 0 || tempFilters.priceRange[1] !== 500) ||
               tempFilters.locationRange[0] !== defaultFilterState.locationRange[0] || 
               tempFilters.locationRange[1] !== defaultFilterState.locationRange[1] ||
               tempFilters.sortBy !== defaultFilterState.sortBy;
      },
      
      getFilterCount: () => {
        const { filters } = get();
        return filters.selectedBrands.length + 
               (filters.onSale !== defaultFilterState.onSale ? 1 : 0) + 
               (filters.inStock !== defaultFilterState.inStock ? 1 : 0) +
               (filters.itemCondition !== defaultFilterState.itemCondition ? 1 : 0) +
               (filters.sellerRating !== null && filters.sellerRating > 0 ? 1 : 0) +
               // Only count age range as active if it's NOT the full range (0-60)
               ((filters.ageRange[0] !== 0 || filters.ageRange[1] !== 60) ? 1 : 0) +
               // Only count price range as active if it's NOT the full range (0-500)
               ((filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500) ? 1 : 0) +
               ((filters.locationRange[0] !== defaultFilterState.locationRange[0] || filters.locationRange[1] !== defaultFilterState.locationRange[1]) ? 1 : 0) +
               (filters.sortBy !== defaultFilterState.sortBy ? 1 : 0);
      },
      
      getTempFilterCount: () => {
        const { tempFilters } = get();
        return tempFilters.selectedBrands.length + 
               (tempFilters.onSale !== defaultFilterState.onSale ? 1 : 0) + 
               (tempFilters.inStock !== defaultFilterState.inStock ? 1 : 0) +
               (tempFilters.itemCondition !== defaultFilterState.itemCondition ? 1 : 0) +
               (tempFilters.sellerRating !== null && tempFilters.sellerRating > 0 ? 1 : 0) +
               // Only count age range as active if it's NOT the full range (0-60)
               ((tempFilters.ageRange[0] !== 0 || tempFilters.ageRange[1] !== 60) ? 1 : 0) +
               // Only count price range as active if it's NOT the full range (0-500)
               ((tempFilters.priceRange[0] !== 0 || tempFilters.priceRange[1] !== 500) ? 1 : 0) +
               ((tempFilters.locationRange[0] !== defaultFilterState.locationRange[0] || tempFilters.locationRange[1] !== defaultFilterState.locationRange[1]) ? 1 : 0) +
               (tempFilters.sortBy !== defaultFilterState.sortBy ? 1 : 0);
      }
    }),
    {
      name: 'filter-store',
      // Only persist the main filters, not the temp state or UI state
      partialize: (state) => ({ filters: state.filters })
    }
  )
);
