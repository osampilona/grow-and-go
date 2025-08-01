
"use client";

import { Avatar, Chip } from "@heroui/react";
import { useCategoryStore } from "../stores/categoryStore";

function CategoriesList() {
  const { selected, toggleCategory, categories } = useCategoryStore();
  return (
    <div
      className="flex gap-3 justify-start lg:justify-center overflow-x-auto custom-scrollbar"
      style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
    >
      {categories.map((category) => {
        const isSelected = selected.includes(category.id);
        return (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={
              `flex flex-col items-center px-2 py-1 focus:outline-none bg-transparent transition-all duration-150 ` +
              (isSelected
                ? "border-b-2 border-black dark:border-white"
                : "border-b-2 border-transparent")
            }
            style={{ minWidth: 66 }}
          >
            {category.img && (
              <img
                src={category.img}
                alt=""
                className="w-7 h-7 mb-1 object-contain dark:invert"
                style={{ minWidth: 28, minHeight: 28 }}
              />
            )}
            <span className={
              `text-xs font-semibold ` +
              (isSelected
                ? "text-black dark:text-white"
                : "text-gray-700 dark:text-gray-200")
            }>
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  // Example data for 15 items
  const items = Array.from({ length: 15 }, (_, i) => ({
    title: `Baby clothes (0-24 months)`,
    seller: `Anna`,
    price: `DKK753`,
    rating: 4.9,
    img: "https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80",
  }));

  return (
    <div>
      <CategoriesList />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="w-full mx-auto rounded-t-2xl overflow-hidden bg-white dark:bg-neutral-900"
          >
            <div className="relative">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-80 object-cover rounded-2xl"
              />
              <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-md border border-white/40 dark:border-black/40 transition hover:bg-white/80 dark:hover:bg-black/60">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 dark:text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-1 mt-1">
                <h3 className="text-base font-semibold text-black dark:text-white truncate">{item.title}</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <p className="text-gray-500 dark:text-gray-300 font-semibold">{item.seller}</p>
                  </div>
                  <span className="flex items-center gap-0.5 text-sm text-black dark:text-white">
                    {item.rating}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 text-yellow-400">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  </span>
                </div>
                <div className="text-base font-semibold text-black dark:text-white mt-2">
                  {item.price}
                </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
