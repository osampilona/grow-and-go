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
}

// Shape stored in state: Record<sellerId, SellerProfile>
export type SellerProfilesMap = Record<string, SellerProfile>;
