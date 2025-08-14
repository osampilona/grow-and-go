import { mockFeed } from "../data/mock/feed";
import { useFeedStore } from "../stores/feedStore";

// Extract numeric price from strings like 'DKK750'
const parsePrice = (price: string): number => {
  const match = price.match(/\d+/g);

  return match ? parseInt(match.join(""), 10) : 0;
};

export const MAX_PRICE: number = mockFeed.reduce((max, item) => {
  const value = parsePrice(item.price);

  return value > max ? value : max;
}, 0);

export { parsePrice };

// Hook helpers for components to get live bounds (fall back to static)
export function useDynamicPriceBounds() {
  const min = useFeedStore((s) => s.minPrice);
  const max = useFeedStore((s) => s.maxPrice);

  return {
    minPrice: min || 0,
    maxPrice: max || MAX_PRICE,
  };
}

export function getStaticPriceBounds() {
  // Non-hook version (e.g., outside React) using static data only
  let min = Number.POSITIVE_INFINITY;
  let max = 0;

  for (const item of mockFeed) {
    const v = parsePrice(item.price);

    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (min === Number.POSITIVE_INFINITY) min = 0;

  return { minPrice: min, maxPrice: max };
}
