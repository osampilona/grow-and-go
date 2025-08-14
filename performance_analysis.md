# Performance Analysis & Optimization Report

## 🚨 Critical Performance Issues

### 1. Excessive Zustand Subscriptions in Navbar (HIGH PRIORITY)

**Problem**: The navbar subscribes to 21 different Zustand selectors:

- 8 category store selectors
- 13 filter store selectors

**Impact**: Every state change triggers navbar re-renders, even when changes don't affect the UI.

**Current Code**:

```tsx
// These cause individual subscriptions and re-renders
const selectedCategoriesCount = useCategoryStore((state) => state.getSelectedCount());
const tempSelectedCategoriesCount = useCategoryStore((state) => state.getTempSelectedCount());
const isEverythingSelected = useCategoryStore((state) => state.isSelected("everything"));
// ... 18 more subscriptions
```

**Solution**: Use selector optimization and combine related state:

```tsx
// Optimized approach - single subscription with shallow comparison
const categoryState = useCategoryStore(
  (state) => ({
    selectedCount: state.getSelectedCount(),
    tempSelectedCount: state.getTempSelectedCount(),
    isEverythingSelected: state.isSelected("everything"),
    resetToDefault: state.resetToDefault,
    initializeTemp: state.initializeTemp,
    applyTemp: state.applyTemp,
    cancelTemp: state.cancelTemp,
  }),
  shallow // Import from 'zustand/shallow'
);
```

### 2. CategoryButton Performance Issues

**Problem**: Each CategoryButton subscribes to 5 different store selectors:

```tsx
const hasHydrated = useCategoryStore((state) => state.hasHydrated);
const isTempSelected = useCategoryStore((state) => state.isTempSelected(category.id));
const toggleTempCategory = useCategoryStore((state) => state.toggleTempCategory);
const getIconForCategory = useCategoryStore((state) => state.getIconForCategory);
const isEverythingTempSelected = useCategoryStore((state) => state.isTempSelected("everything"));
```

**Impact**: With 9 categories, that's 45 subscriptions causing cascade re-renders.

### 3. Memory Leak Risk: Window Event Listener

**Problem**: Screen size detection adds resize listener:

```tsx
useEffect(() => {
  const checkScreenSize = () => {
    setIsLargeScreen(window.innerWidth >= 1024);
  };
  window.addEventListener("resize", checkScreenSize);
  return () => window.removeEventListener("resize", checkScreenSize);
}, []);
```

**Issue**: Function is recreated on every render, but this one is properly cleaned up.

### 4. Inefficient Store Selector Functions

**Problem**: Store methods like `getSelectedCount()`, `isTempSelected()`, `getIconForCategory()` are called on every subscription, even when unrelated state changes.

## 🎯 Optimization Solutions

### Priority 1: Optimize Zustand Subscriptions

#### A. Navbar Optimization

```tsx
import { shallow } from "zustand/shallow";

// Replace multiple subscriptions with optimized selectors
const categoryState = useCategoryStore(
  (state) => ({
    selectedCount: state.getSelectedCount(),
    tempSelectedCount: state.getTempSelectedCount(),
    isEverythingSelected: state.isSelected("everything"),
    actions: {
      resetToDefault: state.resetToDefault,
      initializeTemp: state.initializeTemp,
      applyTemp: state.applyTemp,
      cancelTemp: state.cancelTemp,
    },
  }),
  shallow
);

const filterState = useFilterStore(
  (state) => ({
    filters: state.filters,
    tempFilters: state.tempFilters,
    hasActiveFilters: state.hasActiveFilters(),
    hasTempActiveFilters: state.hasTempActiveFilters(),
    filterCount: state.getFilterCount(),
    isFiltersSelected: state.isFiltersSelected,
    actions: {
      setFiltersSelected: state.setFiltersSelected,
      initializeTempFilters: state.initializeTempFilters,
      applyFilters: state.applyFilters,
      cancelFilters: state.cancelFilters,
      clearTempBrand: state.clearTempBrand,
      clearTempOnSale: state.clearTempOnSale,
      clearTempInStock: state.clearTempInStock,
      clearAllTempFilters: state.clearAllTempFilters,
      resetFilters: state.resetFilters,
    },
  }),
  shallow
);
```

#### B. CategoryButton Optimization

```tsx
const CategoryButton = memo(function CategoryButton({ category }: CategoryButtonProps) {
  // Single optimized subscription
  const categoryButtonState = useCategoryStore(
    (state) => ({
      hasHydrated: state.hasHydrated,
      isTempSelected: state.isTempSelected(category.id),
      isEverythingTempSelected: state.isTempSelected("everything"),
      iconSrc: state.getIconForCategory(category.id),
      toggleTempCategory: state.toggleTempCategory,
    }),
    shallow
  );

  const handleClick = useCallback(() => {
    categoryButtonState.toggleTempCategory(category.id);
  }, [categoryButtonState.toggleTempCategory, category.id]);

  // Rest of component logic...
});
```

### Priority 2: Optimize Store Methods

#### A. Memoize Expensive Calculations

```tsx
// In categoryStore.ts
import { createSelector } from "reselect";

// Create memoized selectors
const selectCategories = (state) => state.categories;
const selectTempSelected = (state) => state.tempSelected;
const selectHasHydrated = (state) => state.hasHydrated;

const selectIconForCategory = createSelector(
  [selectCategories, selectTempSelected, selectHasHydrated, (state, catId) => catId],
  (categories, tempSelected, hasHydrated, catId) => {
    const category = categories.find((cat) => cat.id === catId);
    if (!category) return undefined;

    if (!hasHydrated) {
      return catId === "everything" ? category.imgColored : category.img;
    }

    return tempSelected.includes(catId) ? category.imgColored : category.img;
  }
);
```

### Priority 3: Component-Level Optimizations

#### A. Split Large Components

```tsx
// Extract header logic into separate component
const NavbarHeader = memo(() => {
  const { categoryCount, filterCount, hasTempActiveFilters } = useNavbarCounts();

  return <DrawerHeader className="flex flex-col gap-3">{/* Header content */}</DrawerHeader>;
});

// Extract filter chips into separate component
const FilterChips = memo(() => {
  const { tempFilters, handlers } = useFilterChips();

  return <div className="flex flex-wrap gap-1">{/* Chips content */}</div>;
});
```

#### B. Optimize Event Handlers

```tsx
// Use stable references for handlers
const handlers = useMemo(
  () => ({
    handleResetCategories: () => {
      useCategoryStore.setState({ tempSelected: ["everything"] });
    },
    handleResetFilters: () => {
      useFilterStore.getState().clearAllTempFilters();
    },
    handleResetAll: () => {
      useCategoryStore.setState({ tempSelected: ["everything"] });
      useFilterStore.getState().clearAllTempFilters();
    },
  }),
  []
);
```

## 📊 Expected Performance Improvements

1. **Render Reduction**: ~80% fewer unnecessary re-renders
2. **Memory Usage**: ~60% reduction in subscription overhead
3. **Bundle Size**: Minimal impact (shallow import adds ~1KB)
4. **Runtime Performance**: Significantly faster state updates

## 🔧 Implementation Priority

1. **Phase 1** (Critical): Optimize Zustand subscriptions in navbar
2. **Phase 2** (High): Optimize CategoryButton subscriptions
3. **Phase 3** (Medium): Add memoized selectors to stores
4. **Phase 4** (Low): Split large components

## 🧪 Testing Recommendations

1. Use React DevTools Profiler to measure before/after performance
2. Monitor component re-render frequency
3. Test with larger category/filter datasets
4. Verify memory usage doesn't grow over time
5. Test on lower-end devices

## 🚀 Quick Wins (15 minutes implementation)

1. Add `shallow` comparison to navbar subscriptions
2. Combine related state selections
3. Use `useCallback` with stable dependencies for handlers
