import { create } from "zustand";

import { fetchFeed, FeedItem } from "../data/mock/feed";
import { parsePrice } from "../utils/pricing";

interface FeedStoreState {
  items: FeedItem[];
  loading: boolean;
  error?: string;
  minPrice: number; // derived numeric min price
  maxPrice: number; // derived numeric max price
  loadFeed: () => Promise<void>;
}

export const useFeedStore = create<FeedStoreState>((set, get) => ({
  items: [],
  loading: false,
  error: undefined,
  minPrice: 0,
  maxPrice: 0,
  loadFeed: async () => {
    const { loading, items } = get();

    if (loading || items.length > 0) return; // Avoid duplicate fetches
    set({ loading: true, error: undefined });
    try {
      const data = await fetchFeed();
      // Compute min / max prices from fetched data
      let min = Number.POSITIVE_INFINITY;
      let max = 0;

      for (const item of data) {
        const p = parsePrice(item.price);

        if (p < min) min = p;
        if (p > max) max = p;
      }
      if (min === Number.POSITIVE_INFINITY) min = 0; // Fallback if empty
      set({ items: data, loading: false, minPrice: min, maxPrice: max });
    } catch (e: any) {
      set({ loading: false, error: e?.message || "Failed to load feed" });
    }
  },
}));
