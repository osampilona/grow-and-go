"use client";

import { Navbar as HeroUINavbar, NavbarContent, NavbarBrand, NavbarItem } from "@heroui/navbar";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { memo, useCallback, useEffect, useState, useMemo, useRef } from "react";
import NextLink from "next/link";
import Image from "next/image";

import { useCategoryStore } from "../stores/categoryStore";
import { useFilterStore } from "../stores/filterStore";

import FiltersList from "./FiltersList";
import { FilterSection } from "./FilterSection";
import { FiltersHeader } from "./FiltersHeader";
import CategoriesList from "./CategoriesList";
import { CloseIcon } from "./icons";
import SubcategoryChipsBar from "./SubcategoryChipsBar";

import { ThemeSwitch } from "@/components/theme-switch";
import { useLikeStore } from "@/stores/likeStore";

export const Navbar = memo(function Navbar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onOpenChange: onMenuOpenChange,
  } = useDisclosure();
  const {
    isOpen: isFiltersModalOpen,
    onOpen: onFiltersModalOpen,
    onOpenChange: onFiltersModalOpenChange,
  } = useDisclosure();

  // Optimized category store subscriptions (individual but grouped)
  // const _selectedCategoriesCount = useCategoryStore((state) => state.getSelectedCount());
  const tempSelectedCategoriesCount = useCategoryStore((state) => state.getTempSelectedCount());
  const isEverythingSelected = useCategoryStore((state) => state.isSelected("everything"));
  const resetToDefault = useCategoryStore((state) => state.resetToDefault);
  const initializeTemp = useCategoryStore((state) => state.initializeTemp);
  const applyTemp = useCategoryStore((state) => state.applyTemp);
  const cancelTemp = useCategoryStore((state) => state.cancelTemp);
  // const toggleTempCategory = useCategoryStore((state) => state.toggleTempCategory);

  // Get filter state and actions from store
  // const _filters = useFilterStore((state) => state.filters);
  // const _tempFilters = useFilterStore((state) => state.tempFilters);
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);
  const hasTempActiveFilters = useFilterStore((state) => state.hasTempActiveFilters);
  const getFilterCount = useFilterStore((state) => state.getFilterCount);
  // const _isFiltersSelected = useFilterStore((state) => state.isFiltersSelected);
  const setFiltersSelected = useFilterStore((state) => state.setFiltersSelected);
  const initializeTempFilters = useFilterStore((state) => state.initializeTempFilters);
  const applyFilters = useFilterStore((state) => state.applyFilters);
  const cancelFilters = useFilterStore((state) => state.cancelFilters);
  const setTempGender = useFilterStore((state) => state.setTempGender);
  const clearTempGender = useFilterStore((state) => state.clearTempGender);
  const clearTempOnSale = useFilterStore((state) => state.clearTempOnSale);
  const clearTempInStock = useFilterStore((state) => state.clearTempInStock);
  const clearTempItemCondition = useFilterStore((state) => state.clearTempItemCondition);
  const clearTempSellerRating = useFilterStore((state) => state.clearTempSellerRating);
  const clearTempSortBy = useFilterStore((state) => state.clearTempSortBy);
  const clearTempAgeRange = useFilterStore((state) => state.clearTempAgeRange);
  const clearTempPriceRange = useFilterStore((state) => state.clearTempPriceRange);
  const clearTempLocationRange = useFilterStore((state) => state.clearTempLocationRange);
  const clearAllTempFilters = useFilterStore((state) => state.clearAllTempFilters);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  // State to track screen size
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Effect to handle screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint is 1024px
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize events
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Memoized close handlers to prevent unnecessary re-renders
  const onClose = useCallback(() => {
    // Reset temp state when drawer closes without applying
    cancelTemp();
    cancelFilters();
    onOpenChange();
  }, [onOpenChange, cancelTemp, cancelFilters]);

  const onMenuClose = useCallback(() => {
    onMenuOpenChange();
  }, [onMenuOpenChange]);

  // Memoized button handlers
  const handleCategoryOpen = useCallback(() => {
    // Initialize temp state with current state when drawer opens
    initializeTemp();
    initializeTempFilters();
    onOpen();
  }, [onOpen, initializeTemp, initializeTempFilters]);

  const handleMenuOpen = useCallback(() => {
    onMenuOpen();
  }, [onMenuOpen]);

  // Favorites count
  const favoritesCount = useLikeStore((s) => Object.keys(s.likedIds).length);

  // Handler for filters button (reserved for future use)

  // Handler for when filters modal closes
  const handleFiltersModalClose = useCallback(() => {
    setFiltersSelected(false);
    // Reset temp state to current state with new object reference
    cancelFilters();
    onFiltersModalOpenChange();
  }, [onFiltersModalOpenChange, setFiltersSelected, cancelFilters]);

  // Handler for applying filters (save temp state to main state)
  const handleApplyAll = useCallback(() => {
    applyTemp();
    applyFilters();
  }, [applyTemp, applyFilters]);

  // Handler for applying filters (save temp state to main state)
  const handleApplyFilters = useCallback(() => {
    applyFilters();
  }, [applyFilters]);

  // Handler for canceling filters (revert temp state)
  const handleCancelFilters = useCallback(() => {
    cancelFilters();
  }, [cancelFilters]);

  const handleCancelAll = useCallback(() => {
    cancelTemp();
    cancelFilters();
  }, [cancelTemp, cancelFilters]);

  // Handler for clearing individual filters (works on temp state in modal)
  const handleClearGender = useCallback(
    (gendersToKeep?: string[]) => {
      if (gendersToKeep !== undefined) {
        // Partial clear - set to the remaining genders
        setTempGender(gendersToKeep);
      } else {
        // Full clear - clear all genders
        clearTempGender();
      }
    },
    [setTempGender, clearTempGender]
  );

  const handleClearOnSale = useCallback(() => {
    clearTempOnSale();
  }, [clearTempOnSale]);

  const handleClearInStock = useCallback(() => {
    clearTempInStock();
  }, [clearTempInStock]);

  const handleClearItemCondition = useCallback(() => {
    clearTempItemCondition();
  }, [clearTempItemCondition]);

  const handleClearSellerRating = useCallback(() => {
    clearTempSellerRating();
  }, [clearTempSellerRating]);

  const handleClearSortBy = useCallback(() => {
    clearTempSortBy();
  }, [clearTempSortBy]);

  const handleClearAgeRange = useCallback(() => {
    clearTempAgeRange();
  }, [clearTempAgeRange]);

  const handleClearPriceRange = useCallback(() => {
    clearTempPriceRange();
  }, [clearTempPriceRange]);

  const handleClearLocationRange = useCallback(() => {
    clearTempLocationRange();
  }, [clearTempLocationRange]);

  const handleClearCategory = useCallback((_category: string) => {
    // In single-select mode clearing a category returns to 'everything'
    useCategoryStore.setState({ tempSelected: ["everything"] });
  }, []);

  // const handleClearAllFilters = useCallback(() => {
  //   clearAllTempFilters();
  // }, [clearAllTempFilters]);

  // Optimized reset handlers with stable references
  const resetHandlers = useMemo(
    () => ({
      resetCategories: () => {
        useCategoryStore.setState({ tempSelected: ["everything"] });
      },
      resetFilters: () => {
        clearAllTempFilters();
      },
      resetAll: () => {
        useCategoryStore.setState({ tempSelected: ["everything"] });
        clearAllTempFilters();
      },
    }),
    [clearAllTempFilters]
  );

  // Handler for resetting categories only (only affects temp state)
  const handleResetCategories = useCallback(() => {
    resetHandlers.resetCategories();
  }, [resetHandlers]);

  // Handler for resetting filters only (only affects temp state)
  const handleResetFilters = useCallback(() => {
    resetHandlers.resetFilters();
  }, [resetHandlers]);

  // Handler for resetting everything (only affects temp state)
  const handleResetAll = useCallback(() => {
    resetHandlers.resetAll();
  }, [resetHandlers]);

  // Calculate category count (exclude "everything" from count)
  const categoryCount = tempSelectedCategoriesCount;

  // Get filter count from store
  const filterCount = getFilterCount();

  // Combined count for mobile
  const totalCount = filterCount + categoryCount;

  // Track navbar height to position subcategory chips directly beneath
  const navRef = useRef<HTMLDivElement | null>(null);
  const [navHeight, setNavHeight] = useState<number>(64); // fallback

  useEffect(() => {
    const measure = () => {
      if (navRef.current) {
        const h = navRef.current.offsetHeight;

        if (h && h !== navHeight) setNavHeight(h);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    // Safe idle / deferred measurements for mobile (polyfill if needed)
    const ric: typeof requestIdleCallback | undefined =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback
        : (cb: any) =>
            setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 120) as any;
    const cancelRic: typeof cancelIdleCallback | undefined =
      typeof cancelIdleCallback === "function" ? cancelIdleCallback : (id: any) => clearTimeout(id);
    const idle = ric(measure);
    // Extra fallback after a short delay (fonts/images late load)
    const timeout = setTimeout(measure, 400);

    return () => {
      window.removeEventListener("resize", measure);
      if (idle) cancelRic?.(idle as any);
      clearTimeout(timeout);
    };
  }, [navHeight]);

  return (
    <>
      <HeroUINavbar
        ref={navRef}
        className="z-50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-b border-gray-200/20 dark:border-slate-700/20 pt-2"
        maxWidth="2xl"
        position="sticky"
      >
        <NavbarContent className="basis-1/5 sm:basis-full " justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center cursor-pointer"
              href="/"
              onClick={() => {
                // Reset categories to default
                resetToDefault();
                // Reset all filters
                resetFilters();
              }}
            >
              <Image
                alt="Canopy Logo"
                className="h-8 w-8 object-contain"
                height={32}
                src="/logo.svg"
                width={32}
              />
              <p className="font-bold text-inherit hidden lg:flex">Canopy</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        {/* Categories for large screens */}
        <NavbarContent className="hidden lg:flex basis-1/5 sm:basis-full justify-center">
          <NavbarItem className="flex items-center gap-3">
            <CategoriesList useTemp={false} />
          </NavbarItem>
        </NavbarContent>

        {/* Categories button for smaller screens */}
        <NavbarContent className="flex lg:hidden basis-1/5 sm:basis-full justify-center">
          <NavbarItem>
            <Badge
              color="primary"
              content={totalCount > 0 ? totalCount : undefined}
              showOutline={false}
              size="sm"
            >
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-default-100 transition-colors cursor-pointer"
                onClick={handleCategoryOpen}
              >
                <Image
                  alt="Categories"
                  className={
                    `w-7 h-7 object-contain transition-all duration-150 ` +
                    (hasActiveFilters() || categoryCount > 0 ? "" : "dark:invert")
                  }
                  height={28}
                  src={hasActiveFilters() || categoryCount > 0 ? "/cubes.svg" : "/cubes_bw.svg"}
                  width={28}
                />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </Badge>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
          <NavbarItem>
            <button className="flex items-center cursor-pointer" onClick={handleMenuOpen}>
              <Image
                alt="Menu"
                className="w-8 h-8 object-contain"
                height={32}
                src="/baby-toy.svg"
                width={32}
              />
            </button>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>
      {/* Subcategory chips bar (hidden on small screens, visible lg+) */}
      <SubcategoryChipsBar className="hidden lg:block" stickyOffset={navHeight} />

      {/* Top Drawer for Categories */}
      <Drawer
        backdrop="opaque"
        isDismissable={true}
        isOpen={isOpen}
        placement="top"
        size="xl"
        onOpenChange={(open) => {
          if (!open) {
            // Reset temp state when drawer closes
            cancelTemp();
            cancelFilters();
          }
          onOpenChange();
        }}
      >
        <DrawerContent className="bg-white dark:bg-[#24032c] hide-close-button">
          <DrawerHeader className="flex flex-col gap-3">
            <FiltersHeader
              showCategoryChips={true}
              showResetAll={
                (categoryCount > 0 || !isEverythingSelected) &&
                (filterCount > 0 || hasTempActiveFilters())
              }
              title="Categories & Filters"
              onClearAgeRange={handleClearAgeRange}
              onClearCategory={handleClearCategory}
              onClearGender={handleClearGender}
              onClearInStock={handleClearInStock}
              onClearItemCondition={handleClearItemCondition}
              onClearLocationRange={handleClearLocationRange}
              onClearOnSale={handleClearOnSale}
              onClearPriceRange={handleClearPriceRange}
              onClearSellerRating={handleClearSellerRating}
              onClearSortBy={handleClearSortBy}
              onClose={onClose}
              onResetAll={handleResetAll}
            />
          </DrawerHeader>
          <DrawerBody className="pb-6">
            <FilterSection
              onResetCategories={handleResetCategories}
              onResetFilters={handleResetFilters}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                handleCancelAll();
                onClose();
              }}
            >
              Close
            </Button>
            <Button
              color="primary"
              onPress={() => {
                handleApplyAll();
                onClose();
              }}
            >
              Apply
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Right Drawer for Menu */}
      <Drawer
        backdrop="opaque"
        isDismissable={true}
        isOpen={isMenuOpen}
        placement="right"
        size={isLargeScreen ? "sm" : "xs"}
        onOpenChange={onMenuOpenChange}
      >
        <DrawerContent className="bg-white dark:bg-[#24032c] hide-close-button">
          <DrawerHeader className="flex items-center justify-between px-4 py-3">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              isIconOnly
              className="text-foreground-500"
              radius="full"
              variant="light"
              onPress={onMenuClose}
            >
              <CloseIcon />
            </Button>
          </DrawerHeader>
          <DrawerBody className="pb-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Theme</span>
                <ThemeSwitch />
              </div>
              <NextLink
                className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-default-100 transition-colors"
                href="/favorites"
                onClick={onMenuClose}
              >
                <span className="text-sm font-medium flex items-center gap-2">
                  {/* Heart icon */}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Favorites
                </span>
                {favoritesCount > 0 && (
                  <span className="text-xs font-semibold bg-rose-200 text-rose-800 rounded-full px-2 py-0.5">
                    {favoritesCount}
                  </span>
                )}
              </NextLink>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button color="primary" onPress={onMenuClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Filters Modal */}
      <Modal
        backdrop="opaque"
        isOpen={isFiltersModalOpen}
        placement="center"
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={handleFiltersModalClose}
      >
        <ModalContent className="bg-white dark:bg-[#24032c] hide-close-button">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-3">
                <FiltersHeader
                  showResetAll={filterCount > 0 || hasTempActiveFilters()}
                  title="Filters"
                  onClearAgeRange={handleClearAgeRange}
                  onClearGender={handleClearGender}
                  onClearInStock={handleClearInStock}
                  onClearItemCondition={handleClearItemCondition}
                  onClearLocationRange={handleClearLocationRange}
                  onClearOnSale={handleClearOnSale}
                  onClearPriceRange={handleClearPriceRange}
                  onClearSellerRating={handleClearSellerRating}
                  onClearSortBy={handleClearSortBy}
                  onClose={handleFiltersModalClose}
                  onResetAll={handleResetFilters}
                />
              </ModalHeader>
              <ModalBody>
                <FiltersList />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    handleCancelFilters();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleApplyFilters();
                    onClose();
                  }}
                >
                  Apply Filters
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});
