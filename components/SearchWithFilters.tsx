"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch, IoClose, IoFilter, IoOptions } from "react-icons/io5";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { useFilterStore } from "../stores/filterStore";
import FiltersList from "./FiltersList";
import { FiltersHeader } from "./FiltersHeader";

interface SearchWithFiltersProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchWithFilters = ({ 
  onSearch, 
  placeholder = "Search...",
  className = ""
}: SearchWithFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter modal controls
  const { isOpen: isFilterModalOpen, onOpen: onFilterModalOpen, onOpenChange: onFilterModalOpenChange } = useDisclosure();

  // Filter store - Get functions to call in component
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);
  const hasTempActiveFilters = useFilterStore((state) => state.hasTempActiveFilters);
  const getFilterCount = useFilterStore((state) => state.getFilterCount);
  const getTempFilterCount = useFilterStore((state) => state.getTempFilterCount);
  const tempFilters = useFilterStore((state) => state.tempFilters);
  const initializeTempFilters = useFilterStore((state) => state.initializeTempFilters);
  const applyFilters = useFilterStore((state) => state.applyFilters);
  const cancelFilters = useFilterStore((state) => state.cancelFilters);
  const clearTempBrand = useFilterStore((state) => state.clearTempBrand);
  const clearTempOnSale = useFilterStore((state) => state.clearTempOnSale);
  const clearTempInStock = useFilterStore((state) => state.clearTempInStock);
  const clearTempItemCondition = useFilterStore((state) => state.clearTempItemCondition);
  const clearTempSellerRating = useFilterStore((state) => state.clearTempSellerRating);
  const clearTempSortBy = useFilterStore((state) => state.clearTempSortBy);
  const clearTempAgeRange = useFilterStore((state) => state.clearTempAgeRange);
  const clearTempPriceRange = useFilterStore((state) => state.clearTempPriceRange);
  const clearTempLocationRange = useFilterStore((state) => state.clearTempLocationRange);
  const clearAllTempFilters = useFilterStore((state) => state.clearAllTempFilters);

  // Computed value to check if temp filters are active (reactive to tempFilters changes)
  const hasTempFiltersActive = useMemo(() => {
    return tempFilters.selectedBrands.length > 0 || 
           tempFilters.onSale || 
           !tempFilters.inStock ||
           tempFilters.itemCondition !== "all" ||
           (tempFilters.sellerRating !== null && tempFilters.sellerRating > 0) ||
           // Only count age range as active if it's NOT the full range (0-60)
           (tempFilters.ageRange[0] !== 0 || tempFilters.ageRange[1] !== 60) ||
           // Only count price range as active if it's NOT the full range (0-500)
           (tempFilters.priceRange[0] !== 0 || tempFilters.priceRange[1] !== 500) ||
           // Only count location range as active if it's NOT the default range (5-25)
           (tempFilters.locationRange[0] !== 5 || tempFilters.locationRange[1] !== 25) ||
           tempFilters.sortBy !== "newest";
  }, [tempFilters]);

  // Computed value for temp filter count (reactive to tempFilters changes)
  const tempFilterCount = useMemo(() => {
    return tempFilters.selectedBrands.length + 
           (tempFilters.onSale ? 1 : 0) + 
           (!tempFilters.inStock ? 1 : 0) +
           (tempFilters.itemCondition !== "all" ? 1 : 0) +
           (tempFilters.sellerRating !== null && tempFilters.sellerRating > 0 ? 1 : 0) +
           // Only count age range as active if it's NOT the full range (0-60)
           ((tempFilters.ageRange[0] !== 0 || tempFilters.ageRange[1] !== 60) ? 1 : 0) +
           // Only count price range as active if it's NOT the full range (0-500)
           ((tempFilters.priceRange[0] !== 0 || tempFilters.priceRange[1] !== 500) ? 1 : 0) +
           // Only count location range as active if it's NOT the default range (5-25)
           ((tempFilters.locationRange[0] !== 5 || tempFilters.locationRange[1] !== 25) ? 1 : 0) +
           (tempFilters.sortBy !== "newest" ? 1 : 0);
  }, [tempFilters]);

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle search submission
  const handleSearch = useCallback(() => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  }, [searchQuery, onSearch]);

  // Handle closing the search bar
  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setSearchQuery("");
  }, []);

  // Handle filter modal open
  const handleFilterOpen = useCallback(() => {
    initializeTempFilters();
    onFilterModalOpen();
  }, [initializeTempFilters, onFilterModalOpen]);

  // Handle filter modal close
  const handleFilterClose = useCallback(() => {
    cancelFilters();
  }, [cancelFilters]);

  // Handle apply filters
  const handleApplyFilters = useCallback(() => {
    applyFilters();
  }, [applyFilters]);

  // Clear handlers for active filter chips
  const handleClearBrand = useCallback((brand: string) => {
    clearTempBrand(brand);
  }, [clearTempBrand]);

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

  const handleResetAllFilters = useCallback(() => {
    clearAllTempFilters();
  }, [clearAllTempFilters]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        handleSearch();
        setIsExpanded(false);
      }
    }
    if (e.key === "Escape") {
      handleClose();
    }
  }, [searchQuery, handleSearch, handleClose]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isExpanded]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector('.search-with-filters-container');
      if (searchContainer && !searchContainer.contains(event.target as Node) && isExpanded) {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded, handleClose]);

  // Animation variants
  const widthAnimation = useMemo(() => ({
    width: isExpanded ? "min(600px, calc(100vw - 2rem))" : isLargeScreen ? "300px" : "140px",
  }), [isExpanded, isLargeScreen]);

  const springTransition = useMemo(() => ({
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  }), []);

  // Event handlers
  const handleContainerClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  }, [isExpanded]);

  const handleIconClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpanded) {
      setIsExpanded(true);
    } else if (searchQuery) {
      handleSearch();
      setIsExpanded(false);
    }
  }, [isExpanded, searchQuery, handleSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Handle filter button click
  const handleFilterClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleFilterOpen();
  }, [handleFilterOpen]);

  // Container className
  const containerClassName = useMemo(() => `
    relative flex items-center h-14
    bg-white/60 dark:bg-slate-800/60 
    backdrop-blur-xl 
    ${isExpanded ? 'border border-white/50 dark:border-slate-700/50' : 'border-0'}
    rounded-full
    shadow-lg shadow-black/10 dark:shadow-black/20
    hover:shadow-xl hover:shadow-black/15 dark:hover:shadow-black/30
    transition-shadow duration-300
    cursor-pointer
  `, [isExpanded]);

  return (
    <>
      <div className={`search-with-filters-container ${className}`}>
        <motion.div
          className="relative"
          initial={false}
          animate={widthAnimation}
          transition={springTransition}
        >
          <motion.div
            className={containerClassName}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContainerClick}
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Search Icon / Button */}
            <motion.button
              className="
                flex items-center justify-center
                w-14 h-14 rounded-full
                text-gray-600 dark:text-gray-300
                hover:text-gray-800 dark:hover:text-white
                focus:outline-none
                transition-colors duration-200
                flex-shrink-0
              "
              onClick={handleIconClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IoSearch size={24} />
            </motion.button>

            {/* Content Area */}
            <div className="flex-1 flex items-center overflow-hidden">
              {/* Search Text - Visible when collapsed */}
              <AnimatePresence mode="wait">
                {!isExpanded ? (
                  <motion.div
                    key="search-text"
                    className="pl-1 flex-1 flex items-center justify-between text-gray-800 dark:text-gray-200 text-base font-normal select-none whitespace-nowrap h-[50px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span>Search...</span>
                    {isLargeScreen && (
                      <motion.button
                        className="
                          flex items-center justify-center
                          w-10 h-10 rounded-full
                          text-gray-600 dark:text-gray-300
                          hover:text-gray-800 dark:hover:text-white
                          hover:bg-gray-200/50 dark:hover:bg-gray-700/50
                          focus:outline-none
                          transition-colors duration-200
                          mr-2
                          relative
                        "
                        onClick={handleFilterClick}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IoOptions size={20} />
                        {hasActiveFilters() && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                            {getFilterCount()}
                          </span>
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  /* Input Field */
                  <motion.div
                    key="search-input"
                    className="flex-1 flex items-center pr-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: 0.1 }}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder={placeholder}
                      autoFocus
                      className="
                        flex-1 bg-transparent 
                        text-gray-800 dark:text-white
                        placeholder-gray-800 dark:placeholder-gray-200
                        focus:outline-none
                        text-base
                        font-normal
                        px-3
                      "
                    />
                    
                    {/* Filter Button - Always visible when expanded on large screens */}
                    {isLargeScreen && (
                      <motion.button
                        className="
                          flex items-center justify-center
                          w-10 h-10 rounded-full
                          text-gray-600 dark:text-gray-300
                          hover:text-gray-800 dark:hover:text-white
                          hover:bg-gray-200/50 dark:hover:bg-gray-700/50
                          focus:outline-none
                          transition-colors duration-200
                          mr-2
                          relative
                        "
                        onClick={handleFilterClick}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IoOptions size={20} />
                        {hasActiveFilters() && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                            {getFilterCount()}
                          </span>
                        )}
                      </motion.button>
                    )}
                    
                    {/* Close Button */}
                    {searchQuery && (
                      <motion.button
                        className="
                          flex items-center justify-center
                          w-10 h-10 rounded-full
                          text-gray-500 dark:text-gray-400
                          hover:text-gray-700 dark:hover:text-gray-200
                          hover:bg-gray-200/50 dark:hover:bg-gray-700/50
                          focus:outline-none
                          transition-colors duration-200
                        "
                        onClick={handleClose}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <IoClose size={18} />
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Filter Modal for Large Screens */}
      <Modal 
        isOpen={isFilterModalOpen} 
        onOpenChange={(open) => {
          if (!open) {
            // Modal is closing - cancel any unsaved changes
            handleFilterClose();
          }
          onFilterModalOpenChange();
        }}
        size="2xl"
        scrollBehavior="inside"
        backdrop="opaque"
      >
        <ModalContent className="hide-close-button">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-3">
                <FiltersHeader
                  title="Filters"
                  onClose={onClose}
                  showResetAll={hasTempFiltersActive}
                  onResetAll={handleResetAllFilters}
                  onClearBrand={handleClearBrand}
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
                    handleFilterClose();
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
};

export default SearchWithFilters;
