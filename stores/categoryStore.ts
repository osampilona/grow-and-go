
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Category {
  id: string;
  name: string;
  img?: string;
  imgColored?: string; // Add colored version
}

export interface Subcategory {
  id: string; // unique id (category-prefixed slug)
  name: string; // display name
  categoryId: string; // parent category id
}

// Stable empty array reference for selectors
export const EMPTY_SUBCATEGORY_ARRAY = [] as const as string[]; // stable empty array

// Subcategory definitions (multi-select) keyed by parent category id
export const subcategoryMap: Record<string, Subcategory[]> = {
  strollers: [
    { id: "strollers-strollers", name: "Strollers", categoryId: "strollers" },
    { id: "strollers-car-seats", name: "Car Seats", categoryId: "strollers" },
    { id: "strollers-carriers-wraps", name: "Carriers & Wraps", categoryId: "strollers" },
    { id: "strollers-bikes-scooters", name: "Bikes & Scooters", categoryId: "strollers" },
    { id: "strollers-travel-gear", name: "Travel Gear", categoryId: "strollers" },
  ],
  clothing: [
    { id: "clothing-diaper-bags", name: "Diaper Bags", categoryId: "clothing" },
    { id: "clothing-feeding", name: "Feeding", categoryId: "clothing" },
    { id: "clothing-pacifiers-teethers", name: "Pacifiers & Teethers", categoryId: "clothing" },
    { id: "clothing-baby-monitors", name: "Baby Monitors", categoryId: "clothing" },
    { id: "clothing-health-safety", name: "Health & Safety", categoryId: "clothing" },
    { id: "clothing-hats-gloves", name: "Hats & Gloves", categoryId: "clothing" },
  ],
  "baby-clothes": [
    { id: "baby-clothes-onesies-bodysuits", name: "Onesies & Bodysuits", categoryId: "baby-clothes" },
    { id: "baby-clothes-tops-tshirts", name: "Tops & T-shirts", categoryId: "baby-clothes" },
    { id: "baby-clothes-bottoms-pants", name: "Bottoms & Pants", categoryId: "baby-clothes" },
    { id: "baby-clothes-dresses-skirts", name: "Dresses & Skirts", categoryId: "baby-clothes" },
    { id: "baby-clothes-outerwear", name: "Outerwear", categoryId: "baby-clothes" },
    { id: "baby-clothes-sleepwear", name: "Sleepwear", categoryId: "baby-clothes" },
    { id: "baby-clothes-shoes-socks", name: "Shoes & Socks", categoryId: "baby-clothes" },
    { id: "baby-clothes-swimwear", name: "Swimwear", categoryId: "baby-clothes" },
  ],
  toys: [
    { id: "toys-puzzles", name: "Puzzles", categoryId: "toys" },
    { id: "toys-building-blocks", name: "Building Blocks", categoryId: "toys" },
    { id: "toys-dolls-plush", name: "Dolls & Plush Toys", categoryId: "toys" },
    { id: "toys-action-figures", name: "Action Figures", categoryId: "toys" },
    { id: "toys-board-games", name: "Board Games", categoryId: "toys" },
    { id: "toys-outdoor", name: "Outdoor Toys", categoryId: "toys" },
    { id: "toys-arts-crafts", name: "Arts & Crafts", categoryId: "toys" },
    { id: "toys-musical", name: "Musical Toys", categoryId: "toys" },
  ],
  books: [
    { id: "books-picture", name: "Picture Books", categoryId: "books" },
    { id: "books-chapter", name: "Chapter Books", categoryId: "books" },
    { id: "books-board", name: "Board Books", categoryId: "books" },
    { id: "books-activity", name: "Activity Books", categoryId: "books" },
    { id: "books-educational", name: "Educational Books", categoryId: "books" },
  ],
  gear: [
    { id: "gear-bouncers-swings", name: "Bouncers & Swings", categoryId: "gear" },
    { id: "gear-high-chairs", name: "High Chairs", categoryId: "gear" },
    { id: "gear-playpens", name: "Playpens", categoryId: "gear" },
    { id: "gear-playmats", name: "Playmats", categoryId: "gear" },
    { id: "gear-bath-tubs", name: "Bath Tubs", categoryId: "gear" },
    { id: "gear-potty-seats", name: "Potty Seats", categoryId: "gear" },
  ],
  maternity: [
    { id: "maternity-maternity-clothes", name: "Maternity Clothes", categoryId: "maternity" },
    { id: "maternity-nursing-clothes", name: "Nursing Clothes", categoryId: "maternity" },
    { id: "maternity-breast-pumps", name: "Breast Pumps", categoryId: "maternity" },
    { id: "maternity-belly-bands", name: "Belly Bands", categoryId: "maternity" },
    { id: "maternity-books", name: "Books", categoryId: "maternity" },
  ],
  room: [
    { id: "room-cribs", name: "Cribs", categoryId: "room" },
    { id: "room-changing-tables", name: "Changing Tables", categoryId: "room" },
    { id: "room-gliders-rockers", name: "Gliders & Rockers", categoryId: "room" },
    { id: "room-dressers", name: "Dressers", categoryId: "room" },
    { id: "room-shelves-storage", name: "Shelves & Storage", categoryId: "room" },
    { id: "room-kids-tables-chairs", name: "Kids' Tables & Chairs", categoryId: "room" },
  ],
};

export const categories: Category[] = [
  { id: "everything", name: "Everything", img: "/cubes_bw.svg", imgColored: "/cubes.svg" },
  { id: "strollers", name: "Transport", img: "/stroller_bw.svg", imgColored: "/stroller.svg" },
  { id: "clothing", name: "Accessories", img: "/bottle_bw.svg", imgColored: "/bottle.svg" },
  { id: "baby-clothes", name: "Clothes", img: "/clothes_bw.svg", imgColored: "/clothes.svg" },
  { id: "toys", name: "Toys", img: "/toys_bw.svg", imgColored: "/toys.svg" },
  { id: "books", name: "Books", img: "/reading_bw.svg", imgColored: "/reading.svg" },
  { id: "gear", name: "Gear", img: "/gear_bw.svg", imgColored: "/gear.svg" },
  { id: "maternity", name: "Maternity", img: "/maternity_bw.svg", imgColored: "/maternity.svg" },
  { id: "room", name: "Furniture", img: "/highchair_bw.svg", imgColored: "/highchair.svg" },
];

interface CategoryState {
  selected: string[]; // single selected category (array for minimal refactor)
  tempSelected: string[]; // temp single selected category
  // Subcategory selections maintained per category id for persistence when switching
  subcategoriesByCategory: Record<string, string[]>; // applied selections
  tempSubcategoriesByCategory: Record<string, string[]>; // temp selections (used in drawers if needed)
  categories: Category[];
  isLoading: boolean;
  hasHydrated: boolean;
  isEditing: boolean;
  
  // Actions
  initializeTemp: () => void;
  applyTemp: () => void;
  cancelTemp: () => void;
  toggleTempCategory: (catId: string) => void;
  toggleCategory: (catId: string) => void;
  selectCategory: (catId: string) => void;
  selectMultipleCategories: (catIds: string[]) => void;
  clearSelections: () => void;
  resetToDefault: () => void;
  isSelected: (catId: string) => boolean;
  isTempSelected: (catId: string) => boolean;
  getSelectedCategories: () => Category[];
  getSelectedCount: () => number;
  getTempSelectedCount: () => number;
  getIconForCategory: (catId: string) => string | undefined; // New method to get appropriate icon
  setHasHydrated: (hasHydrated: boolean) => void;
  // Subcategory actions / getters
  getSubcategoriesForSelected: () => Subcategory[];
  getSelectedSubcategoryIds: () => string[];
  toggleSubcategory: (subcategoryId: string) => void; // applied (navbar chips)
  clearSubcategoriesForSelected: () => void;
  clearAllSubcategories: () => void;
  // Temp subcategory helpers (for drawer editing on small screens)
  getTempSelectedSubcategoryIds: () => string[];
  toggleTempSubcategory: (subcategoryId: string) => void;
  clearTempSubcategoriesForSelected: () => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
  // Stable empty array reference to prevent new [] on every selector run
  // (avoid unnecessary re-renders when no subcategories selected)
  selected: ["everything"],
  tempSelected: ["everything"],
  subcategoriesByCategory: {},
  tempSubcategoriesByCategory: {},
  isEditing: false,
      categories,
      isLoading: false,
      hasHydrated: false,

      initializeTemp: () => set(state => ({ tempSelected: state.selected, isEditing: true })),
      applyTemp: () => set(state => ({ 
        selected: state.tempSelected, 
        subcategoriesByCategory: { ...state.subcategoriesByCategory, ...(state.tempSubcategoriesByCategory || {}) },
        isEditing: false
      })),
      cancelTemp: () => set(state => ({ 
        tempSelected: state.selected,
        tempSubcategoriesByCategory: { ...state.subcategoriesByCategory },
        isEditing: false
      })),

      toggleTempCategory: (catId: string) => set((state) => {
        // Toggle behavior: if clicking the already-selected category (not 'everything'), close by switching to 'everything'
        const current = state.tempSelected[0];
        const isTogglingOff = current === catId && catId !== "everything";
        if (isTogglingOff) {
          const clone = { ...state.tempSubcategoriesByCategory };
          delete clone[current];
          return { tempSelected: ["everything"], tempSubcategoriesByCategory: clone } as any;
        }
        const nextCat = catId === "everything" ? "everything" : catId;
        return { tempSelected: [nextCat] } as any;
      }),

      toggleCategory: (catId: string) => set((state) => {
        // Toggle behavior: if clicking the already-selected category (not 'everything'), close by switching to 'everything'
        const current = state.selected[0];
        const isTogglingOff = current === catId && catId !== "everything";
        if (isTogglingOff) {
          const clone = { ...state.subcategoriesByCategory };
          delete clone[current];
          return { selected: ["everything"], subcategoriesByCategory: clone } as any;
        }
        const nextCat = catId === "everything" ? "everything" : catId;
        return { selected: [ nextCat ] } as any;
      }),
      
  selectCategory: (catId: string) => set(() => ({ selected: [catId] })),
      
  selectMultipleCategories: (catIds: string[]) => set(() => ({ selected: catIds.length ? [catIds[0]] : ["everything"] })), // legacy API safeguard
      
  clearSelections: () => set(() => ({ selected: ["everything"] })),
      
      resetToDefault: () => set(() => ({
        selected: ["everything"],
        tempSelected: ["everything"],
        subcategoriesByCategory: {},
        tempSubcategoriesByCategory: {},
        isEditing: false,
      })),
      
      isSelected: (catId: string) => {
        const state = get();
        // During SSR or before hydration, show default state
        if (!state.hasHydrated) {
          return catId === "everything";
        }
        return state.selected.includes(catId);
      },

      isTempSelected: (catId: string) => {
        const state = get();
        // During SSR or before hydration, show default state
        if (!state.hasHydrated) {
          return catId === "everything";
        }
        return state.tempSelected.includes(catId);
      },
      
      getSelectedCategories: () => {
        const { selected, categories } = get();
        return categories.filter(cat => selected.includes(cat.id));
      },
      
      getSelectedCount: () => {
        const state = get();
        if (state.selected.includes("everything")) return 0;
        return state.selected.length;
      },

      getTempSelectedCount: () => {
        const state = get();
        if (state.tempSelected.includes("everything")) return 0;
        return state.tempSelected.length;
      },
      
      getIconForCategory: (catId: string) => {
        const { categories, tempSelected, selected, hasHydrated, isEditing } = get();
        const category = categories.find(cat => cat.id === catId);
        if (!category) return undefined;

        // During SSR or before hydration, show default state
        if (!hasHydrated) {
          return catId === "everything" ? category.imgColored : category.img;
        }
        const activeArray = isEditing ? tempSelected : selected;
        const isActive = activeArray.includes(catId);
        return isActive ? category.imgColored : category.img;
      },
      
      setHasHydrated: (hasHydrated: boolean) => set(() => ({ hasHydrated })),
      
      // Subcategory helpers / actions
      getSubcategoriesForSelected: () => {
        const state = get();
        const catId = state.selected[0];
        if (!catId || catId === "everything") return [];
        return subcategoryMap[catId] || [];
      },
      getSelectedSubcategoryIds: () => {
        const state = get();
        const catId = state.selected[0];
  if (!catId) return EMPTY_SUBCATEGORY_ARRAY;
  return state.subcategoriesByCategory[catId] || EMPTY_SUBCATEGORY_ARRAY;
      },
      getTempSelectedSubcategoryIds: () => {
        const state = get();
        const catId = state.tempSelected[0];
        if (!catId) return EMPTY_SUBCATEGORY_ARRAY;
        return state.tempSubcategoriesByCategory[catId] || EMPTY_SUBCATEGORY_ARRAY;
      },
      toggleSubcategory: (subcategoryId: string) => set((state) => {
        const catId = state.selected[0];
        if (!catId || catId === "everything") return {} as any;
        const current = state.subcategoriesByCategory[catId] || [];
        const exists = current.includes(subcategoryId);
        const updated = exists ? current.filter(id => id !== subcategoryId) : [...current, subcategoryId];
        return {
          subcategoriesByCategory: { ...state.subcategoriesByCategory, [catId]: updated }
        };
      }),
      toggleTempSubcategory: (subcategoryId: string) => set((state) => {
        const catId = state.tempSelected[0];
        if (!catId || catId === "everything") return {} as any;
        const current = state.tempSubcategoriesByCategory[catId] || [];
        const exists = current.includes(subcategoryId);
        const updated = exists ? current.filter(id => id !== subcategoryId) : [...current, subcategoryId];
        return {
          tempSubcategoriesByCategory: { ...state.tempSubcategoriesByCategory, [catId]: updated }
        };
      }),
      clearSubcategoriesForSelected: () => set((state) => {
        const catId = state.selected[0];
        if (!catId) return {} as any;
        const clone = { ...state.subcategoriesByCategory };
        delete clone[catId];
        return { subcategoriesByCategory: clone };
      }),
      clearTempSubcategoriesForSelected: () => set((state) => {
        const catId = state.tempSelected[0];
        if (!catId) return {} as any;
        const clone = { ...state.tempSubcategoriesByCategory };
        delete clone[catId];
        return { tempSubcategoriesByCategory: clone };
      }),
      clearAllSubcategories: () => set(() => ({ subcategoriesByCategory: {}, tempSubcategoriesByCategory: {} })),
    }),
    {
      name: 'category-store', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({}), // Don't persist anything - always start fresh
      onRehydrateStorage: () => (state) => {
        // Always reset to default on reload
        state?.resetToDefault();
        state?.setHasHydrated(true);
      },
    }
  )
);

