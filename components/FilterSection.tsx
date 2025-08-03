import { memo } from "react";
import { Button } from "@heroui/button";
import CategoriesList from "./CategoriesList";
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

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Categories</h3>
          {categoryCount > 0 && (
            <Button
              size="sm"
              variant="flat"
              color="secondary"
              onPress={onResetCategories}
              className="text-xs"
            >
              Reset Categories
            </Button>
          )}
        </div>
        <CategoriesList />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Filters</h3>
          {(filterCount > 0 || hasTempActiveFilters) && (
            <Button
              size="sm"
              variant="flat"
              color="secondary"
              onPress={onResetFilters}
              className="text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
        <FiltersList />
      </div>
    </div>
  );
});
