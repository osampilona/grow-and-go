"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";
import NextLink from "next/link";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import { memo, useCallback, useEffect, useState, useMemo } from "react";

import { ThemeSwitch } from "@/components/theme-switch";
import CategoriesList from "./CategoriesList";
import FiltersList from "./FiltersList";
import { FilterSection } from "./FilterSection";
import { FiltersHeader } from "./FiltersHeader";
import { useCategoryStore } from "../stores/categoryStore";
import { useFilterStore } from "../stores/filterStore";
import { CloseIcon } from "./icons";

export const Navbar = memo(function Navbar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onOpenChange: onMenuOpenChange } = useDisclosure();
  const { isOpen: isFiltersModalOpen, onOpen: onFiltersModalOpen, onOpenChange: onFiltersModalOpenChange } = useDisclosure();

  // Optimized category store subscriptions (individual but grouped)
  const selectedCategoriesCount = useCategoryStore((state) => state.getSelectedCount());
  const tempSelectedCategoriesCount = useCategoryStore((state) => state.getTempSelectedCount());
  const isEverythingSelected = useCategoryStore((state) => state.isSelected("everything"));
  const resetToDefault = useCategoryStore((state) => state.resetToDefault);
  const initializeTemp = useCategoryStore((state) => state.initializeTemp);
  const applyTemp = useCategoryStore((state) => state.applyTemp);
  const cancelTemp = useCategoryStore((state) => state.cancelTemp);
  const toggleTempCategory = useCategoryStore((state) => state.toggleTempCategory);

    // Get filter state and actions from store
  const filters = useFilterStore((state) => state.filters);
  const tempFilters = useFilterStore((state) => state.tempFilters);
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);
  const hasTempActiveFilters = useFilterStore((state) => state.hasTempActiveFilters);
  const getFilterCount = useFilterStore((state) => state.getFilterCount);
  const isFiltersSelected = useFilterStore((state) => state.isFiltersSelected);
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
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
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

  // Handler for filters button
  const handleFiltersClick = useCallback(() => {
    setFiltersSelected(true);
    // Initialize temp state with current state with new object reference
    initializeTempFilters();
    onFiltersModalOpen();
  }, [onFiltersModalOpen, setFiltersSelected, initializeTempFilters]);

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
  const handleClearGender = useCallback((gendersToKeep?: string[]) => {
    if (gendersToKeep !== undefined) {
      // Partial clear - set to the remaining genders
      setTempGender(gendersToKeep);
    } else {
      // Full clear - clear all genders
      clearTempGender();
    }
  }, [setTempGender, clearTempGender]);

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

  const handleClearCategory = useCallback((category: string) => {
    // In single-select mode clearing a category returns to 'everything'
    useCategoryStore.setState({ tempSelected: ["everything"] });
  }, []);

  const handleClearAllFilters = useCallback(() => {
    clearAllTempFilters();
  }, [clearAllTempFilters]);

  // Optimized reset handlers with stable references
  const resetHandlers = useMemo(() => ({
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
  }), [clearAllTempFilters]);

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

  return (
    <>
      <HeroUINavbar maxWidth="2xl" position="sticky" className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-b border-gray-200/20 dark:border-slate-700/20 pt-2">
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
              <img src="/logo.svg" alt="Canopy Logo" className="h-8 w-8 object-contain" />
              <p className="font-bold text-inherit hidden lg:flex">Canopy</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        {/* Categories for large screens */}
        <NavbarContent className="hidden lg:flex basis-1/5 sm:basis-full justify-center">
          <NavbarItem className="flex items-center gap-3">
            <CategoriesList />
          </NavbarItem>
        </NavbarContent>

        {/* Categories button for smaller screens */}
        <NavbarContent className="flex lg:hidden basis-1/5 sm:basis-full justify-center!">
          <NavbarItem>
            <Badge 
              content={totalCount > 0 ? totalCount : undefined}
              color="primary"
              size="sm"
              showOutline={false}
            >
              <button 
                onClick={handleCategoryOpen}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-default-100 transition-colors cursor-pointer"
              >
                <img 
                  src={(hasActiveFilters() || categoryCount > 0) ? "/cubes.svg" : "/cubes_bw.svg"} 
                  alt="Categories" 
                  className={
                    `w-7 h-7 object-contain transition-all duration-150 ` +
                    ((hasActiveFilters() || categoryCount > 0) ? "" : "dark:invert")
                  }
                />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </Badge>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
          <NavbarItem>
            <button 
              onClick={handleMenuOpen}
              className="flex items-center cursor-pointer"
            >
              <img 
                src="/baby-toy.svg" 
                alt="Menu" 
                className="w-8 h-8 object-contain" 
              />
            </button>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      {/* Top Drawer for Categories */}
      <Drawer 
        isOpen={isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            // Reset temp state when drawer closes
            cancelTemp();
            cancelFilters();
          }
          onOpenChange();
        }}
        placement="top"
        size="xl"
        isDismissable={true}
        backdrop="opaque"
      >
        <DrawerContent className="bg-white dark:bg-slate-800 hide-close-button">
          <DrawerHeader className="flex flex-col gap-3">
            <FiltersHeader
              title="Categories & Filters"
              onClose={onClose}
              showResetAll={(categoryCount > 0 || !isEverythingSelected) && (filterCount > 0 || hasTempActiveFilters())}
              onResetAll={handleResetAll}
              showCategoryChips={true}
              onClearCategory={handleClearCategory}
              onClearGender={handleClearGender}
              onClearOnSale={handleClearOnSale}
              onClearInStock={handleClearInStock}
              onClearItemCondition={handleClearItemCondition}
              onClearSellerRating={handleClearSellerRating}
              onClearSortBy={handleClearSortBy}
              onClearAgeRange={handleClearAgeRange}
              onClearPriceRange={handleClearPriceRange}
              onClearLocationRange={handleClearLocationRange}
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
        isOpen={isMenuOpen} 
        onOpenChange={onMenuOpenChange}
        placement="right"
        size={isLargeScreen ? "sm" : "xs"}
        isDismissable={true}
        backdrop="opaque"
      >
        <DrawerContent className="bg-white dark:bg-slate-800 hide-close-button">
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
        isOpen={isFiltersModalOpen} 
        onOpenChange={handleFiltersModalClose}
        placement="center"
        backdrop="opaque"
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-white dark:bg-slate-800 hide-close-button">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-3">
                <FiltersHeader
                  title="Filters"
                  onClose={handleFiltersModalClose}
                  showResetAll={(filterCount > 0 || hasTempActiveFilters())}
                  onResetAll={handleResetFilters}
                  onClearGender={handleClearGender}
                  onClearOnSale={handleClearOnSale}
                  onClearInStock={handleClearInStock}
                  onClearItemCondition={handleClearItemCondition}
                  onClearSellerRating={handleClearSellerRating}
                  onClearSortBy={handleClearSortBy}
                  onClearAgeRange={handleClearAgeRange}
                  onClearPriceRange={handleClearPriceRange}
                  onClearLocationRange={handleClearLocationRange}
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
