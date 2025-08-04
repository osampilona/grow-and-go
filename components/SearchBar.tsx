"use client";

import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch, IoClose } from "react-icons/io5";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = memo(({ 
  onSearch, 
  placeholder = "Search...",
  className = ""
}: SearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search submission
  const handleSearch = useCallback(() => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  }, [searchQuery, onSearch]);

  // Handle closing the search bar
  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setSearchQuery(""); // Clear input when closing
  }, []);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        handleSearch();
        setIsExpanded(false); // Close the search bar after search
      }
    }
    if (e.key === "Escape") {
      handleClose();
    }
  }, [searchQuery, handleSearch, handleClose]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      // Use requestAnimationFrame to ensure the input is fully rendered
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isExpanded]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node) && isExpanded) {
        handleClose(); // This will clear the input and close
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded, handleClose]);

    // Memoize animation variants to prevent recreating objects
  const widthAnimation = useMemo(() => ({
    width: isExpanded ? "min(400px, calc(100vw - 2rem))" : "140px",
  }), [isExpanded]);

  const springTransition = useMemo(() => ({
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  }), []);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleContainerClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  }, [isExpanded]);

  const handleIconClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent double trigger from parent div
    if (!isExpanded) {
      setIsExpanded(true);
    } else if (searchQuery) {
      handleSearch();
      setIsExpanded(false); // Close after search
    }
  }, [isExpanded, searchQuery, handleSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Memoize className to prevent string concatenation on every render
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
    <div className={`search-container ${className}`}>
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

          {/* Content Area - Always positioned after icon */}
          <div className="flex-1 flex items-center overflow-hidden">
            {/* Search Text - Visible when collapsed */}
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="search-text"
                  className="pl-1 pr-4 text-gray-800 dark:text-gray-200 text-base font-normal select-none whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Search...
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
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
