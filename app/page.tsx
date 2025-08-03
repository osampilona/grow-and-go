
"use client";

import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import { useEffect, useState, useMemo } from "react";
import { fetchFeed, FeedItem } from "../data/mock/feed";

export default function Home() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchFeed().then((data) => {
      setItems(data);
      setFilteredItems(data);
    });
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

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
      images: item.images,
    })),
    [filteredItems]
  );

  return (
    <div className="relative">
      {/* Floating Search Bar - Bottom of screen */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search..."
        />
      </div>

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
