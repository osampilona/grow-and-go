import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FilterState {
  ageRange: number[];
  priceRange: number[];
  selectedBrands: string[];
  sortBy: string;
  inStock: boolean;
  onSale: boolean;
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
  setTempSelectedBrands: (brands: string[]) => void;
  setTempSortBy: (sortBy: string) => void;
  setTempInStock: (inStock: boolean) => void;
  setTempOnSale: (onSale: boolean) => void;
  
  // Individual temp filter clearing actions
  clearTempBrand: (brand: string) => void;
  clearTempOnSale: () => void;
  clearTempInStock: () => void;
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

const defaultFilterState: FilterState = {
  ageRange: [0, 36],
  priceRange: [10, 200],
  selectedBrands: [],
  sortBy: "newest",
  inStock: true,
  onSale: false
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
               filters.onSale || 
               !filters.inStock ||
               filters.ageRange[0] !== 0 || 
               filters.ageRange[1] !== 36 ||
               filters.priceRange[0] !== 10 || 
               filters.priceRange[1] !== 200;
      },
      
      hasTempActiveFilters: () => {
        const { tempFilters } = get();
        return tempFilters.selectedBrands.length > 0 || 
               tempFilters.onSale || 
               !tempFilters.inStock ||
               tempFilters.ageRange[0] !== 0 || 
               tempFilters.ageRange[1] !== 36 ||
               tempFilters.priceRange[0] !== 10 || 
               tempFilters.priceRange[1] !== 200;
      },
      
      getFilterCount: () => {
        const { filters } = get();
        return filters.selectedBrands.length + 
               (filters.onSale ? 1 : 0) + 
               (!filters.inStock ? 1 : 0) +
               ((filters.ageRange[0] !== 0 || filters.ageRange[1] !== 36) ? 1 : 0) +
               ((filters.priceRange[0] !== 10 || filters.priceRange[1] !== 200) ? 1 : 0);
      },
      
      getTempFilterCount: () => {
        const { tempFilters } = get();
        return tempFilters.selectedBrands.length + 
               (tempFilters.onSale ? 1 : 0) + 
               (!tempFilters.inStock ? 1 : 0) +
               ((tempFilters.ageRange[0] !== 0 || tempFilters.ageRange[1] !== 36) ? 1 : 0) +
               ((tempFilters.priceRange[0] !== 10 || tempFilters.priceRange[1] !== 200) ? 1 : 0);
      }
    }),
    {
      name: 'filter-store',
      // Only persist the main filters, not the temp state or UI state
      partialize: (state) => ({ filters: state.filters })
    }
  )
);
