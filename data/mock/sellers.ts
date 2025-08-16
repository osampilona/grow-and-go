import type { SellerProfilesMap } from "@/types/seller";

// Mock seller profile data – enriches sellers with style & preference metadata.
// In a real system this comes from a dedicated user profile service / table.
export const mockSellerProfiles: SellerProfilesMap = {
  "1": {
    sellerId: "1",
    preferences: {
      styleKeywords: ["curated basics", "layering", "seasonal rotation"],
      preferredMaterials: ["organic cotton", "bamboo blend", "recycled knit"],
      favoriteBrands: ["H&M", "Name It", "Konges Sløjd"],
      colors: {
        dominant: "#E2E8F0",
        accents: ["#F2C94C", "#A3BFFA"],
        neutrals: ["#FFFFFF", "#F8F9FA", "#CBD5E1"],
      },
      designOrientation: ["gender-neutral"],
      valueFocus: ["durability", "second-life", "mix & match"],
      insights: [
        "Typically sells bundles after children size up (6–8 month turnover)",
        "Bundles are pre-sorted by age to reduce buyer effort",
      ],
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  },
  "3": {
    sellerId: "3",
    preferences: {
      styleKeywords: ["minimal", "soft textures"],
      preferredMaterials: ["muslin", "organic cotton"],
      favoriteBrands: ["Aden + Anais", "Liewood"],
      colors: {
        dominant: "#F1F5F9",
        accents: ["#FBCFE8", "#BFDBFE"],
        neutrals: ["#FFFFFF", "#E2E8F0"],
      },
      designOrientation: ["calming", "gender-neutral"],
      valueFocus: ["comfort", "quality"],
      insights: ["Focuses on soft layers for newborn to 18 months"],
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  },
  "6": {
    sellerId: "6",
    preferences: {
      styleKeywords: ["eco", "organic", "functional"],
      preferredMaterials: ["glass", "organic cotton"],
      favoriteBrands: ["BIBS", "BabyBjörn"],
      colors: {
        dominant: "#F8FAFC",
        accents: ["#A7F3D0", "#FDE68A"],
        neutrals: ["#FEFCE8", "#E2E8F0"],
      },
      designOrientation: ["practical", "eco conscious"],
      valueFocus: ["sustainability", "reusability"],
      insights: ["Prefers BPA-free & organic certified items"],
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  },
};
