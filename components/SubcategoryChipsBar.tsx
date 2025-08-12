"use client";
import { memo, useMemo, useCallback, useState, useEffect } from "react";
import { Chip } from "@heroui/chip";
import { useCategoryStore, subcategoryMap, EMPTY_SUBCATEGORY_ARRAY } from "../stores/categoryStore";
import { getSubcategoryColor } from "@/utils/colors";
import { CloseIcon } from "./icons";

interface SubcategoryChipsBarProps {
  useTemp?: boolean; // edit mode (drawer) uses temp state
  className?: string;
  stickyOffset?: number; // allow different sticky top offsets
}

// Displays subcategories for the currently selected category (excluding 'everything')
// Allows multi-select via chips.

export const SubcategoryChipsBar = memo(function SubcategoryChipsBar({ useTemp = false, className = "", stickyOffset = 64 }: SubcategoryChipsBarProps) {
  const selectedCategoryId = useCategoryStore((s) => (useTemp ? s.tempSelected[0] : s.selected[0]));
  const toggleSubcategory = useCategoryStore((s) => useTemp ? s.toggleTempSubcategory : s.toggleSubcategory);
  const clearFn = useCategoryStore((s) => useTemp ? s.clearTempSubcategoriesForSelected : s.clearSubcategoriesForSelected);
  // Derive selected subcategory IDs directly from appropriate state
  const selectedSubcategoryIds = useCategoryStore((s) => {
    const catId = useTemp ? s.tempSelected[0] : s.selected[0];
    if (!catId || catId === "everything") return EMPTY_SUBCATEGORY_ARRAY;
    return (useTemp ? s.tempSubcategoriesByCategory[catId] : s.subcategoriesByCategory[catId]) || EMPTY_SUBCATEGORY_ARRAY;
  });

  const subcategories = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === "everything") return [];
    return subcategoryMap[selectedCategoryId] || [];
  }, [selectedCategoryId]);

  const selectedSet = useMemo(() => new Set(selectedSubcategoryIds), [selectedSubcategoryIds]);

  const handleToggle = useCallback((id: string) => {
    toggleSubcategory(id);
  }, [toggleSubcategory]);

  const [visible, setVisible] = useState(true);

  // Close handler: also reset selected category to 'everything' and clear its subcategories
  const handleHide = useCallback(() => {
    if (selectedCategoryId && selectedCategoryId !== "everything") {
      useCategoryStore.setState((state) => {
        if (useTemp) {
          const clone = { ...(state.tempSubcategoriesByCategory || {}) } as Record<string, string[]>;
          delete clone[selectedCategoryId];
          return { tempSelected: ["everything"], tempSubcategoriesByCategory: clone } as any;
        } else {
          const clone = { ...(state.subcategoriesByCategory || {}) } as Record<string, string[]>;
          delete clone[selectedCategoryId];
          return { selected: ["everything"], subcategoriesByCategory: clone } as any;
        }
      });
    }
    setVisible(false);
  }, [selectedCategoryId, useTemp]);

  // When category changes, re-open the bar automatically (so user can see new subcategories)
  useEffect(() => {
    setVisible(true);
  }, [selectedCategoryId]);

  if (!subcategories.length || !visible) return null;

  return (
    <div
      className={`w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl backdrop-saturate-150 px-0 lg:px-4 py-2 sticky z-40 ${className} relative shadow-sm before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gray-300/60 dark:before:via-slate-600/50 before:to-transparent`}
      style={{ top: stickyOffset }}
    >
      {/* Chips container */}
      <div className="flex flex-wrap gap-2 lg:justify-center">
        {subcategories.map(sc => {
          const isSelected = selectedSet.has(sc.id);
      return (
            <Chip
              key={sc.id}
              size="sm"
              variant={isSelected ? "solid" : "flat"}
        color={isSelected ? getSubcategoryColor(sc.id) : "default"}
              onClick={() => handleToggle(sc.id)}
              className="cursor-pointer"
            >
              {sc.name}
            </Chip>
          );
        })}
      </div>
      {/* Controls (Clear + Close) */}
      <div className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 gap-2">
        {selectedSet.size > 0 && (
          <Chip
            size="sm"
            variant="flat"
            color="danger"
            onClick={() => clearFn()}
            className="cursor-pointer"
          >
            Clear
          </Chip>
        )}
        <button
          aria-label="Hide subcategories"
            onClick={handleHide}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-default-100 hover:bg-default-200 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-sm transition-colors"
        >
          <CloseIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Mobile controls (if ever shown on mobile use case) */}
      <div className="flex lg:hidden mt-2 w-full gap-2 justify-end">
        {selectedSet.size > 0 && (
          <Chip
            size="sm"
            variant="flat"
            color="danger"
            onClick={() => clearFn()}
            className="cursor-pointer"
          >
            Clear
          </Chip>
        )}
        <button
          aria-label="Hide subcategories"
          onClick={handleHide}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-default-100 hover:bg-default-200 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-sm transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

export default SubcategoryChipsBar;
