
import { create } from "zustand";

export interface Category {
  id: string;
  name: string;
  img?: string;
}

export const categories: Category[] = [
  { id: "strollers", name: "Strollers & car seats", img: "/baby-carriage.svg" },
  { id: "clothing", name: "Clothing & Accessories", img: "/baby-socks.svg" },
  { id: "baby-clothes", name: "Baby clothes (0-24 months)", img: "/onesie.svg" },
  { id: "toys", name: "Toys & Play", img: "/toys.svg" },
  { id: "books", name: "Books & Learning", img: "/baby-book.svg" },
  { id: "gear", name: "Baby Gear & Equipment", img: "/phone.svg" },
  { id: "maternity", name: "Maternity & Nursing", img: "/mother.svg" },
  { id: "room", name: "Room & Furniture", img: "/feeding-chair.svg" },
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

