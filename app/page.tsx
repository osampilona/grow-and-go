
"use client";

import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import SearchWithFilters from "../components/SearchWithFilters";
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchFeed, FeedItem } from "../data/mock/feed"; // 🚨 REMOVE WHEN BACKEND IS READY: Mock data import
import { useCategoryStore } from "../stores/categoryStore";
import { useFilterStore } from "../stores/filterStore";
import { buildSearchParams, searchItems } from "../utils/api";

export default function Home() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  
  // Get reset functions from stores - ONLY get them once, not on every render
  const resetToDefault = useCategoryStore((state) => state.resetToDefault);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const setFiltersModalOpen = useFilterStore((state) => state.setFiltersModalOpen);
  const setFiltersSelected = useFilterStore((state) => state.setFiltersSelected);
  
  // Get applied filters from store
  const filters = useFilterStore((state) => state.filters);
  
  // Get selected categories from store for backend integration
  const selectedCategories = useCategoryStore((state) => state.selected);

  // BACKEND INTEGRATION HELPER - ready for when you connect to real API
  // 🚨 REMOVE WHEN BACKEND IS READY: This function is temporary for development
  const performBackendSearch = useCallback(async () => {
    const searchParams = buildSearchParams(searchQuery, filters, selectedCategories);
    console.log('Ready for backend API call with params:', searchParams); // 🚨 REMOVE: development logging
    
    // TODO: Uncomment when backend is ready
    // const results = await searchItems(searchParams);
    // setItems(results.items);
  }, [searchQuery, filters, selectedCategories]);

  // Screen size detection - MEMOIZED to prevent unnecessary re-renders
  useEffect(() => {
    const checkScreenSize = () => {
      const newIsLargeScreen = window.innerWidth >= 1024;
      setIsLargeScreen(prevIsLargeScreen => 
        prevIsLargeScreen !== newIsLargeScreen ? newIsLargeScreen : prevIsLargeScreen
      );
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // 🚨 REMOVE WHEN BACKEND IS READY: Mock data loading (temporary)
  // Load items once on mount
  useEffect(() => {
    fetchFeed().then((data) => {
      setItems(data);
    });
  }, []);

  // Reset all filters and selections on page load/reload - MEMOIZED dependencies
  useEffect(() => {
    resetToDefault(); // Reset categories to "everything"
    resetFilters();   // Reset all filters to default
    setSearchQuery(""); // Reset search query
    setFiltersModalOpen(false); // Close any open filter modals
    setFiltersSelected(false);  // Reset filters selection state
  }, []); // Empty deps - only run on mount

  // TODO: Replace with backend API call when ready
  // For now, apply client-side filtering to mock data
  // 🚨 REMOVE WHEN BACKEND IS READY: All client-side filtering logic below
  const filteredItems = useMemo(() => {
    // In production, this will be replaced with:
    // const response = await api.searchItems({ searchQuery, filters, categories })
    
    let filtered = items;

    // CLIENT-SIDE FILTERING (temporary - will be moved to backend)
    // 🚨 REMOVE: Search query filtering (move to backend)
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(queryLower) ||
        item.seller.name.toLowerCase().includes(queryLower)
      );
    }

    // 🚨 REMOVE: Item condition filtering (move to backend)
    if (filters.itemCondition && filters.itemCondition !== 'all') {
      filtered = filtered.filter((item) => item.condition === filters.itemCondition);
    }

    // 🚨 REMOVE: Seller rating filtering (move to backend)
    if (filters.sellerRating !== null && filters.sellerRating > 0) {
      filtered = filtered.filter((item) => item.rating >= filters.sellerRating!);
    }

    // 🚨 REMOVE: Price range filtering (move to backend)
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      filtered = filtered.filter((item) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        return price >= minPrice && price <= maxPrice;
      });
    }

    // BACKEND-ONLY FILTERS (not implemented client-side):
    // - Gender filtering (filters.gender)
    // - Age range filtering (filters.ageRange) 
    // - Location filtering (filters.locationRange)
    // - Stock status (filters.inStock)
    // - Sale status (filters.onSale)
    // - Sorting (filters.sortBy)
    // - Category filtering (from categoryStore)

    return filtered;
  }, [searchQuery, items, filters]);

  // Handle search - MEMOIZED
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // OPTIMIZED: Only memoize essential data, remove unnecessary mapping
  const cardItems = useMemo(() => filteredItems, [filteredItems]);

  // MEMOIZED: Search results message
  const searchResultsMessage = useMemo(() => {
    if (!searchQuery) return null;
    
    return (
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{searchQuery}"
        {filteredItems.length !== items.length && (
          <button
            onClick={() => setSearchQuery("")}
            className="ml-2 text-blue-500 hover:text-blue-600 underline"
          >
            Clear search
          </button>
        )}
      </div>
    );
  }, [searchQuery, filteredItems.length, items.length]);

  // MEMOIZED: No results message
  const noResultsMessage = useMemo(() => {
    if (!searchQuery || filteredItems.length > 0) return null;
    
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400">
          <div className="text-lg mb-2">No results found</div>
          <div className="text-sm">
            Try searching with different keywords or 
            <button
              onClick={() => setSearchQuery("")}
              className="ml-1 text-blue-500 hover:text-blue-600 underline"
            >
              browse all products
            </button>
          </div>
        </div>
      </div>
    );
  }, [searchQuery, filteredItems.length]);

  return (
    <div className="relative">
      {/* Floating Search Bar - Bottom of screen for smaller screens */}
      {!isLargeScreen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search..."
          />
        </div>
      )}

      {/* SearchWithFilters - Bottom of screen for large screens */}
      {isLargeScreen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <SearchWithFilters 
            onSearch={handleSearch}
            placeholder="Search..."
          />
        </div>
      )}

      {/* Results count */}
      {searchResultsMessage}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6 mx-0 pb-24">
        {cardItems.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>

      {/* No results message */}
      {noResultsMessage}
    </div>
  );
}
