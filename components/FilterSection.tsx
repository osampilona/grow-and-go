import { memo, useMemo } from "react";
import { Button } from "@heroui/button";
import CategoriesList from "./CategoriesList";
import SubcategoryChipsBar from "./SubcategoryChipsBar";
import FiltersList from "./FiltersList";
import { useCategoryStore } from "../stores/categoryStore";
import { useFilterStore } from "../stores/filterStore";

interface FilterSectionProps {
  onResetCategories: () => void;
  onResetFilters: () => void;
}

export const FilterSection = memo(function FilterSection({
  onResetCategories,
  onResetFilters
}: FilterSectionProps) {
  const categoryCount = useCategoryStore((state) => state.getTempSelectedCount());
  const filterCount = useFilterStore((state) => state.getFilterCount());
  const hasTempActiveFilters = useFilterStore((state) => state.hasTempActiveFilters());

  // MEMOIZED: Category reset button to prevent unnecessary re-renders
  const categoryResetButton = useMemo(() => {
    if (categoryCount <= 0) return null;
    
    return (
      <Button
        size="sm"
        variant="flat"
        color="secondary"
        onPress={onResetCategories}
        className="text-xs"
      >
        Reset Categories
      </Button>
    );
  }, [categoryCount, onResetCategories]);

  // MEMOIZED: Filter reset button to prevent unnecessary re-renders
  const filterResetButton = useMemo(() => {
    if (!(filterCount > 0 || hasTempActiveFilters)) return null;
    
    return (
      <Button
        size="sm"
        variant="flat"
        color="secondary"
        onPress={onResetFilters}
        className="text-xs"
      >
        Reset Filters
      </Button>
    );
  }, [filterCount, hasTempActiveFilters, onResetFilters]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Categories</h3>
          {categoryResetButton}
        </div>
        <CategoriesList />
        {/* Subcategories (mobile drawer editing) */}
        <div className="mt-3">
          <SubcategoryChipsBar useTemp stickyOffset={0} className="relative px-0 lg:px-3 py-1 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm" />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Filters</h3>
          {filterResetButton}
        </div>
        <FiltersList />
      </div>
    </div>
  );
});
