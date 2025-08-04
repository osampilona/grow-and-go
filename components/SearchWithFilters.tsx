"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch, IoClose, IoFilter, IoOptions } from "react-icons/io5";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { useFilterStore } from "../stores/filterStore";
import FiltersList from "./FiltersList";
import { ActiveFiltersChips } from "./ActiveFiltersChips";

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

  // Filter store
  const hasActiveFilters = useFilterStore((state) => state.hasActiveFilters);
  const hasTempActiveFilters = useFilterStore((state) => state.hasTempActiveFilters);
  const getFilterCount = useFilterStore((state) => state.getFilterCount);
  const getTempFilterCount = useFilterStore((state) => state.getTempFilterCount);
  const initializeTempFilters = useFilterStore((state) => state.initializeTempFilters);
  const applyFilters = useFilterStore((state) => state.applyFilters);
  const cancelFilters = useFilterStore((state) => state.cancelFilters);
  const clearTempBrand = useFilterStore((state) => state.clearTempBrand);
  const clearTempOnSale = useFilterStore((state) => state.clearTempOnSale);
  const clearTempInStock = useFilterStore((state) => state.clearTempInStock);
  const clearTempItemCondition = useFilterStore((state) => state.clearTempItemCondition);

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
    onFilterModalOpenChange();
  }, [cancelFilters, onFilterModalOpenChange]);

  // Handle apply filters
  const handleApplyFilters = useCallback(() => {
    applyFilters();
    onFilterModalOpenChange();
  }, [applyFilters, onFilterModalOpenChange]);

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
                    className="pl-1 flex-1 flex items-center justify-between text-gray-800 dark:text-gray-200 text-base font-normal select-none whitespace-nowrap"
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
        onOpenChange={onFilterModalOpenChange}
        size="2xl"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <IoFilter size={24} />
                  <span>Filters</span>
                  {hasTempActiveFilters() && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                      {getTempFilterCount()} active
                    </span>
                  )}
                </div>
                {hasTempActiveFilters() && (
                  <ActiveFiltersChips
                    onClearBrand={handleClearBrand}
                    onClearOnSale={handleClearOnSale}
                    onClearInStock={handleClearInStock}
                    onClearItemCondition={handleClearItemCondition}
                  />
                )}
              </ModalHeader>
              <ModalBody>
                <FiltersList />
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={handleFilterClose}
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleApplyFilters}
                  disabled={!hasTempActiveFilters()}
                >
                  Apply Filters
                  {hasTempActiveFilters() && (
                    <span className="ml-1">({getTempFilterCount()})</span>
                  )}
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
