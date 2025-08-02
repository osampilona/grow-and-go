
"use client";

import Card from "../components/Card";
import { useEffect, useState } from "react";
import { fetchFeed, FeedItem } from "../data/mock/feed";
import CategoriesList from "../components/CategoriesList";



export default function Home() {
  const [items, setItems] = useState<FeedItem[]>([]);
  useEffect(() => {
    fetchFeed().then(setItems);
  }, []);

  return (
    <div>
      <CategoriesList />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6 mx-0">
        {items.map((item) => (
          <Card key={item.id} item={{
            title: item.title,
            seller: item.seller,
            price: item.price,
            rating: item.rating,
            images: item.images,
          }} />
        ))}
      </div>
    </div>
  );
}
