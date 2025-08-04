
"use client";

import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import SearchWithFilters from "../components/SearchWithFilters";
import { useEffect, useState, useMemo } from "react";
import { fetchFeed, FeedItem } from "../data/mock/feed";
import { useCategoryStore } from "../stores/categoryStore";
import { useFilterStore } from "../stores/filterStore";

export default function Home() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  
  // Get reset functions from stores
  const resetToDefault = useCategoryStore((state) => state.resetToDefault);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const setFiltersModalOpen = useFilterStore((state) => state.setFiltersModalOpen);
  const setFiltersSelected = useFilterStore((state) => state.setFiltersSelected);
  
  // Get applied filters from store
  const filters = useFilterStore((state) => state.filters);

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  useEffect(() => {
    fetchFeed().then((data) => {
      setItems(data);
    });
  }, []);

  // Reset all filters and selections on page load/reload
  useEffect(() => {
    resetToDefault(); // Reset categories to "everything"
    resetFilters();   // Reset all filters to default
    setSearchQuery(""); // Reset search query
    setFiltersModalOpen(false); // Close any open filter modals
    setFiltersSelected(false);  // Reset filters selection state
  }, [resetToDefault, resetFilters, setFiltersModalOpen, setFiltersSelected]); // Include dependencies

  // Filter items based on search query and applied filters
  useEffect(() => {
    let filtered = items;

    // Apply search query filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply item condition filter
    if (filters.itemCondition && filters.itemCondition !== 'all') {
      filtered = filtered.filter((item) => item.condition === filters.itemCondition);
    }

    // Apply price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      filtered = filtered.filter((item) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply other filters as needed (age range, brands, stock status, etc.)
    // You can add more filter logic here as your app grows

    setFilteredItems(filtered);
  }, [searchQuery, items, filters]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Memoize the card items to prevent unnecessary re-renders
  const cardItems = useMemo(() => 
    filteredItems.map((item) => ({
      id: item.id,
      title: item.title,
      seller: item.seller,
      price: item.price,
      rating: item.rating,
      condition: item.condition,
      images: item.images,
    })),
    [filteredItems]
  );

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
      {searchQuery && (
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
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6 mx-0 pb-24">
        {cardItems.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>

      {/* No results message */}
      {searchQuery && filteredItems.length === 0 && (
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
      )}
    </div>
  );
}
