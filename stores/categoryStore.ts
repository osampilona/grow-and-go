
import { create } from "zustand";

export interface Category {
  id: string;
  name: string;
  img?: string;
}

export const categories: Category[] = [
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
    selected: [],
    toggleCategory: (catId: string) => set((state) =>
      state.selected.includes(catId)
        ? { selected: state.selected.filter((c) => c !== catId) }
        : { selected: [...state.selected, catId] }
    ),
    categories,
  };
});

