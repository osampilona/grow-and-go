"use client";

import NextLink from "next/link";

import Card, { type CardItem } from "@/components/Card";
import { useLikeStore } from "@/stores/likeStore";
import { mockFeed, type FeedItem } from "@/data/mock/feed";

function toCardItem(f: FeedItem): CardItem {
  return {
    id: f.id,
    title: f.title,
    user: { userId: f.user.userId, name: f.user.name, avatar: f.user.avatar },
    price: f.price,
    rating: f.user.rating,
    condition: f.condition,
    images: f.images,
  };
}

export default function FavoritesPage() {
  const likedMap = useLikeStore((s) => s.likedIds);
  const likedItems = mockFeed.filter((it) => !!likedMap[it.id]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Favorites</h1>
        <span className="text-sm text-foreground/60">
          {likedItems.length} item{likedItems.length === 1 ? "" : "s"}
        </span>
      </div>

      {likedItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-foreground/70 mb-4">You don’t have any favorites yet.</p>
          <NextLink
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-default-100 hover:bg-default-200 transition text-sm font-medium"
            href="/"
          >
            {/* Heart outline icon */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Browse items
          </NextLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedItems.map((f) => (
            <Card key={f.id} item={toCardItem(f)} />
          ))}
        </div>
      )}
    </div>
  );
}
