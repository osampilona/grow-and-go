import { useCategoryStore } from "../stores/categoryStore";

export default function CategoriesList() {
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
