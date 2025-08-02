
"use client";

import Card from "../components/Card";
import { useEffect, useState, useMemo } from "react";
import { fetchFeed, FeedItem } from "../data/mock/feed";

export default function Home() {
  const [items, setItems] = useState<FeedItem[]>([]);
  
  useEffect(() => {
    fetchFeed().then(setItems);
  }, []);

  // Memoize the card items to prevent unnecessary re-renders
  const cardItems = useMemo(() => 
    items.map((item) => ({
      id: item.id,
      title: item.title,
      seller: item.seller,
      price: item.price,
      rating: item.rating,
      images: item.images,
    })),
    [items]
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6 mx-0">
        {cardItems.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
