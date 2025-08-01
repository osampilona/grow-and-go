
"use client";

import { Chip } from "@heroui/react";
import { useCategoryStore } from "../stores/categoryStore";

function CategoriesList() {
  const { selected, toggleCategory, categories } = useCategoryStore();
  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-2 mb-4 justify-start lg:justify-start overflow-x-auto lg:overflow-x-auto">
      {categories.map((category) => (
        <Chip
          key={category.id}
          onClick={() => toggleCategory(category.id)}
          classNames={{
            base:
              `cursor-pointer transition-all duration-150 flex items-center gap-1 ` +
              (selected.includes(category.id)
                ? "bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white"
                : "bg-transparent text-black dark:text-white border border-black/30 dark:border-white/30"),
            content: "font-semibold flex items-center gap-1",
          }}
        >
          {category.img && (
            <img
              src={category.img}
              alt=""
              className={
                `w-5 h-5 mr-1 inline-block align-middle ` +
                (selected.includes(category.id)
                  ? "text-white dark:text-black" // selected: white text (light), black text (dark)
                  : "text-black dark:text-white") // unselected: black text (light), white text (dark)
                + " " +
                (selected.includes(category.id)
                  ? "filter invert dark:invert-0" // selected: icon white (light), black (dark)
                  : "filter-none dark:invert") // unselected: icon black (light), white (dark)
              }
              style={{ minWidth: 20, minHeight: 20 }}
            />
          )}
          {category.name}
        </Chip>
      ))}
    </div>
  );
}

export default function Home() {
  // Example data for 15 items
  const items = Array.from({ length: 15 }, (_, i) => ({
    title: `Baby Clothes (0-24 months) #${i + 1}`,
    price: `$${(19.99 + i * 2).toFixed(2)}`,
    img: "https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&w=400&q=80",
  }));

  return (
    <div>
      <CategoriesList />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="max-w-xs w-full mx-auto rounded-xl overflow-hidden shadow-lg border border-black/10 dark:border-white/20 bg-white dark:bg-neutral-900"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">{item.title}</h3>
              <p className="text-xl font-bold text-black dark:text-white">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
