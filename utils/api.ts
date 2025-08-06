import { FilterState } from '../stores/filterStore';

export interface SearchParams {
  query?: string;
  categories?: string[];
  filters: {
    gender?: string[];
    ageRange?: number[];
    priceRange?: number[];
    locationRange?: number;
    sortBy?: string;
    inStock?: boolean;
    onSale?: boolean;
    itemCondition?: string;
    sellerRating?: number | null;
    isLocationRangeSet?: boolean;
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

/**
 * Converts frontend filter state to backend API parameters
 */
export function buildSearchParams(
  searchQuery: string,
  filters: FilterState,
  selectedCategories: string[],
  page: number = 1,
  limit: number = 20
): SearchParams {
  // Filter out "everything" from categories
  const validCategories = selectedCategories.filter(cat => cat !== "everything");
  
  return {
    query: searchQuery.trim() || undefined,
    categories: validCategories.length > 0 ? validCategories : undefined,
    filters: {
      gender: filters.gender.length > 0 ? filters.gender : undefined,
      ageRange: (filters.ageRange[0] !== 0 || filters.ageRange[1] !== 60) 
        ? filters.ageRange : undefined,
      priceRange: (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500) 
        ? filters.priceRange : undefined,
      locationRange: filters.isLocationRangeSet ? filters.locationRange : undefined,
      sortBy: filters.sortBy !== "newest" ? filters.sortBy : undefined,
      inStock: filters.inStock !== true ? filters.inStock : undefined,
      onSale: filters.onSale !== false ? filters.onSale : undefined,
      itemCondition: filters.itemCondition !== "all" ? filters.itemCondition : undefined,
      sellerRating: (filters.sellerRating !== null && filters.sellerRating > 0) 
        ? filters.sellerRating : undefined,
    },
    pagination: { page, limit }
  };
}

/**
 * Mock API function - replace with actual backend call
 * 
 * 🚨 REMOVE WHEN BACKEND IS READY:
 * - This entire function is temporary
 * - Replace with real API endpoint call
 * - Remove console.log and mock return values
 */
export async function searchItems(params: SearchParams) {
  // TODO: Replace with actual API call
  // return await fetch('/api/search', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(params)
  // }).then(res => res.json());
  
  // 🚨 REMOVE: Mock logging (temporary for development)
  console.log('Backend search params:', params);
  
  // 🚨 REMOVE: Mock response (temporary for development)
  return {
    items: [],
    total: 0,
    page: params.pagination?.page || 1,
    hasMore: false
  };
}

/**
 * Example backend endpoint structure you'll need:
 * 
 * POST /api/search
 * {
 *   "query": "baby shoes",
 *   "categories": ["clothes", "accessories"],
 *   "filters": {
 *     "gender": ["Boy"],
 *     "ageRange": [0, 12],
 *     "priceRange": [50, 200],
 *     "locationRange": 15,
 *     "sortBy": "price-low",
 *     "inStock": true,
 *     "onSale": false,
 *     "itemCondition": "like-new",
 *     "sellerRating": 4.0
 *   },
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20
 *   }
 * }
 */
