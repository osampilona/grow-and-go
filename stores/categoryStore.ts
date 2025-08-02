
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Category {
  id: string;
  name: string;
  img?: string;
}

export const categories: Category[] = [
  { id: "everything", name: "Everything", img: "/everything.svg" },
  { id: "strollers", name: "Transport", img: "/baby-carriage.svg" },
  { id: "clothing", name: "Accessories", img: "/baby-socks.svg" },
  { id: "baby-clothes", name: "Clothes", img: "/onesie.svg" },
  { id: "toys", name: "Toys", img: "/toys.svg" },
  { id: "books", name: "Books", img: "/baby-book.svg" },
  { id: "gear", name: "Gear", img: "/phone.svg" },
  { id: "maternity", name: "Maternity", img: "/mother.svg" },
  { id: "room", name: "Furniture", img: "/feeding-chair.svg" },
];

interface CategoryState {
  selected: string[]; // array of category ids
  categories: Category[];
  isLoading: boolean;
  
  // Actions
  toggleCategory: (catId: string) => void;
  selectCategory: (catId: string) => void;
  selectMultipleCategories: (catIds: string[]) => void;
  clearSelections: () => void;
  resetToDefault: () => void;
  isSelected: (catId: string) => boolean;
  getSelectedCategories: () => Category[];
  getSelectedCount: () => number;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      selected: ["everything"],
      categories,
      isLoading: false,
      
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
        selected: ["everything"]
      })),
      
      isSelected: (catId: string) => {
        return get().selected.includes(catId);
      },
      
      getSelectedCategories: () => {
        const { selected, categories } = get();
        return categories.filter(cat => selected.includes(cat.id));
      },
      
      getSelectedCount: () => {
        return get().selected.length;
      },
    }),
    {
      name: 'category-store', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ selected: state.selected }), // only persist selected categories
    }
  )
);

