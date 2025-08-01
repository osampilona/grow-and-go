
import { create } from "zustand";

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
  toggleCategory: (catId: string) => void;
  categories: Category[];
}

export const useCategoryStore = create<CategoryState>((set) => {
  return {
    selected: ["everything"],
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
    categories,
  };
});

