
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Category {
  id: string;
  name: string;
  img?: string;
  imgColored?: string; // Add colored version
}

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
  selected: string[]; // array of category ids
  tempSelected: string[]; // temporary array of category ids
  categories: Category[];
  isLoading: boolean;
  hasHydrated: boolean;
  
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
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      selected: ["everything"],
      tempSelected: ["everything"],
      categories,
      isLoading: false,
      hasHydrated: false,

      initializeTemp: () => set(state => ({ tempSelected: state.selected })),
      applyTemp: () => set(state => ({ selected: state.tempSelected })),
      cancelTemp: () => set(state => ({ tempSelected: state.selected })),

      toggleTempCategory: (catId: string) => set((state) => {
        // If selecting 'everything', unselect all others and select only 'everything'
        if (catId === "everything") {
          return { tempSelected: ["everything"] };
        }
        // If 'everything' is currently selected and user selects another, unselect 'everything' and select only the new one
        if (state.tempSelected.includes("everything")) {
          return { tempSelected: [catId] };
        }
        // If the category is already selected, unselect it
        if (state.tempSelected.includes(catId)) {
          const newSelected = state.tempSelected.filter((c) => c !== catId);
          // If nothing left selected, default back to 'everything'
          return { tempSelected: newSelected.length ? newSelected : ["everything"] };
        }
        // Otherwise, select the new category (multi-select allowed except for 'everything')
        return { tempSelected: [...state.tempSelected, catId] };
      }),
      
      toggleCategory: (catId: string) => set((state) => {
        // If selecting 'everything', unselect all others and select only 'everything'
        if (catId === "everything") {
          return { selected: ["everything"] };
        }
        // If 'everything' is currently selected and user selects another, unselect 'everything' and select only the new one
        if (state.selected.includes("everything")) {
          return { selected: [catId] };
        }
        // If the category is already selected, unselect it
        if (state.selected.includes(catId)) {
          const newSelected = state.selected.filter((c) => c !== catId);
          // If nothing left selected, default back to 'everything'
          return { selected: newSelected.length ? newSelected : ["everything"] };
        }
        // Otherwise, select the new category (multi-select allowed except for 'everything')
        return { selected: [...state.selected, catId] };
      }),
      
      selectCategory: (catId: string) => set(() => ({
        selected: [catId]
      })),
      
      selectMultipleCategories: (catIds: string[]) => set(() => ({
        selected: catIds.length ? catIds : ["everything"]
      })),
      
      clearSelections: () => set(() => ({
        selected: []
      })),
      
      resetToDefault: () => set(() => ({
        selected: ["everything"],
        tempSelected: ["everything"]
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
        const { categories, tempSelected, hasHydrated } = get();
        const category = categories.find(cat => cat.id === catId);
        if (!category) return undefined;
        
        // During SSR or before hydration, show default state
        if (!hasHydrated) {
          return catId === "everything" ? category.imgColored : category.img;
        }
        
        // Show colored icon if selected, black/white if not
        return tempSelected.includes(catId) ? category.imgColored : category.img;
      },
      
      setHasHydrated: (hasHydrated: boolean) => set(() => ({ hasHydrated })),
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

