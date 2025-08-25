// Data model for extended seller style / preference profile.
// This is kept separate from product-level flags (smokeFree, etc.) so we can evolve it
// independently without touching every feed item. Treat it as user metadata.

export type ColorPalettePref = {
  dominant?: string; // Hex or token id
  accents?: string[]; // Accent colors used often
  neutrals?: string[]; // Neutral tones
};

export interface SellerStylePreferences {
  // High-level style adjectives ("minimal", "playful", "organic", etc.)
  styleKeywords: string[];
  // Preferred material keywords ("organic cotton", "wood", "silicone")
  preferredMaterials: string[];
  // Brands the seller buys / lists often
  favoriteBrands: string[];
  // Color story
  colors?: ColorPalettePref;
  // Gender / design orientation ("gender-neutral", "unisex pastels", etc.)
  designOrientation?: string[];
  // What they tend to prioritise when sourcing items
  valueFocus?: string[]; // e.g. ["durability", "sustainability", "second-life"]
  // Narrative insights automatically derived later (machine generated sentences)
  insights?: string[]; // e.g. ["Typically sells items after 6–8 months of light use"]
  // Timestamp for incremental enrichment / ML generated versioning
  updatedAt: string; // ISO
  version: number; // Schema evolution / ML model version
}

export interface SellerProfile {
  sellerId: string;
  preferences: SellerStylePreferences;
  // Optional reviews data for UI
  reviews?: Review[];
  reviewStats?: ReviewStats;
}

// Shape stored in state: Record<sellerId, SellerProfile>
export type SellerProfilesMap = Record<string, SellerProfile>;

// Review and aggregate stats are placed with the seller profile
export type Review = {
  id: string;
  reviewer: {
    userId: string;
    name: string;
    avatar: string;
  };
  rating: number; // 1..5
  comment: string;
  createdAt: string; // ISO date
  itemId?: string; // optional: the item this review refers to
};

export type ReviewStats = {
  count: number;
  average: number; // average rating 1..5
  breakdown: { [stars: number]: number }; // e.g. {5: 10, 4: 2, 3: 0, 2: 0, 1: 0}
};
