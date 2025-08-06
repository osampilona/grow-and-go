"use client";

import { memo, useMemo, useCallback } from "react";
import { Slider } from "@heroui/slider";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { useFilterStore } from "../stores/filterStore";
import { useFilterOptimizations } from "../hooks/useFilterOptimizations";

const FiltersList = memo(function FiltersList() {
  // Use optimized hook instead of direct store access
  const optimizedFilters = useFilterOptimizations();
  
  // Get only the action functions we need
  const setTempAgeRange = useFilterStore((state) => state.setTempAgeRange);
  const setTempPriceRange = useFilterStore((state) => state.setTempPriceRange);
  const setTempSortBy = useFilterStore((state) => state.setTempSortBy);
  const setTempInStock = useFilterStore((state) => state.setTempInStock);
  const setTempOnSale = useFilterStore((state) => state.setTempOnSale);
  const setTempItemCondition = useFilterStore((state) => state.setTempItemCondition);
  const setTempSellerRating = useFilterStore((state) => state.setTempSellerRating);
  const setTempLocationRange = useFilterStore((state) => state.setTempLocationRange);
  const toggleTempGender = useFilterStore((state) => state.toggleTempGender);

  // MEMOIZED: Button click handlers with stable references
  const handleBoyClick = useCallback(() => toggleTempGender("Boy"), [toggleTempGender]);
  const handleGirlClick = useCallback(() => toggleTempGender("Girl"), [toggleTempGender]);

  // MEMOIZED: Gender button styles to prevent recalculation
  const boyButtonClass = useMemo(() => 
    `flex flex-col items-center px-2 py-1 rounded-lg hover:bg-default-100 focus:outline-none transition-all duration-150 cursor-pointer ` +
    (optimizedFilters.genderState.isBoySelected 
      ? "bg-stone-200/80 backdrop-blur-sm dark:bg-white/10 dark:backdrop-blur-sm" 
      : ""),
    [optimizedFilters.genderState.isBoySelected]
  );

  const girlButtonClass = useMemo(() => 
    `flex flex-col items-center px-2 py-1 rounded-lg hover:bg-default-100 focus:outline-none transition-all duration-150 cursor-pointer ` +
    (optimizedFilters.genderState.isGirlSelected 
      ? "bg-stone-200/80 backdrop-blur-sm dark:bg-white/10 dark:backdrop-blur-sm" 
      : ""),
    [optimizedFilters.genderState.isGirlSelected]
  );

  // MEMOIZED: Image sources to prevent recalculation
  const boyImageSrc = useMemo(() => 
    optimizedFilters.genderState.isBoySelected ? "/boy.svg" : "/boy_bw.svg",
    [optimizedFilters.genderState.isBoySelected]
  );

  const girlImageSrc = useMemo(() => 
    optimizedFilters.genderState.isGirlSelected ? "/girl.svg" : "/girl_bw.svg",
    [optimizedFilters.genderState.isGirlSelected]
  );

  // MEMOIZED: Static style objects to prevent recreation
  const buttonBaseStyle = useMemo(() => ({ minWidth: 66 }), []);
  const imageStyle = useMemo(() => ({ minWidth: 28, minHeight: 28 }), []);

  // MEMOIZED: Other handlers to prevent unnecessary re-renders
  const handleAgeRangeChange = useCallback((value: number | number[]) => {
    setTempAgeRange(Array.isArray(value) ? value : [value]);
  }, [setTempAgeRange]);

  const handlePriceRangeChange = useCallback((value: number | number[]) => {
    setTempPriceRange(Array.isArray(value) ? value : [value]);
  }, [setTempPriceRange]);

  const handleSortByChange = useCallback((keys: any) => {
    setTempSortBy(Array.from(keys)[0] as string);
  }, [setTempSortBy]);

  const handleItemConditionChange = useCallback((keys: any) => {
    setTempItemCondition(Array.from(keys)[0] as string);
  }, [setTempItemCondition]);

  const handleSellerRatingChange = useCallback((keys: any) => {
    const rating = Array.from(keys)[0];
    setTempSellerRating(rating ? parseFloat(rating as string) : null);
  }, [setTempSellerRating]);

  const handleLocationRangeChange = useCallback((value: number | number[]) => {
    setTempLocationRange(Array.isArray(value) ? value[0] : value);
  }, [setTempLocationRange]);

  // MEMOIZED: Tooltip content to prevent recreating objects
  const ageTooltipContent = useMemo(() => 
    `${optimizedFilters.ageRange[0]} - ${optimizedFilters.ageRange[1]} months`, 
    [optimizedFilters.ageRange]
  );

  const priceTooltipContent = useMemo(() => 
    `$${optimizedFilters.priceRange[0]} - $${optimizedFilters.priceRange[1]}`, 
    [optimizedFilters.priceRange]
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Gender Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Gender</h3>
        <div className="flex gap-3">
          <button
            onClick={handleBoyClick}
            className={boyButtonClass}
            style={buttonBaseStyle}
          >
            <img
              src={boyImageSrc}
              alt="Boy"
              className={`w-7 h-7 mb-1 object-contain transition-all duration-150 ${
                optimizedFilters.genderState.isBoySelected ? "" : "dark:invert"
              }`}
              style={imageStyle}
            />
            <span className="text-xs font-semibold text-foreground">
              Boy
            </span>
          </button>
          
          <button
            onClick={handleGirlClick}
            className={girlButtonClass}
            style={buttonBaseStyle}
          >
            <img
              src={girlImageSrc}
              alt="Girl"
              className={`w-7 h-7 mb-1 object-contain transition-all duration-150 ${
                optimizedFilters.genderState.isGirlSelected ? "" : "dark:invert"
              }`}
              style={imageStyle}
            />
            <span className="text-xs font-semibold text-foreground">
              Girl
            </span>
          </button>
        </div>
      </div>
      {/* Age Range Slider */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Age Range (months)</h3>
        <Slider
          label="Age"
          step={1}
          minValue={0}
          maxValue={60}
          value={optimizedFilters.ageRange}
          onChange={handleAgeRangeChange}
          className="w-full"
          color="primary"
          showTooltip={true}
          tooltipProps={{
            content: ageTooltipContent
          }}
        />
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Price Range</h3>
        <Slider
          label="Price Range"
          step={5}
          minValue={0}
          maxValue={500}
          value={optimizedFilters.priceRange}
          onChange={handlePriceRangeChange}
          className="w-full"
          color="secondary"
          showTooltip={true}
          tooltipProps={{
            content: priceTooltipContent
          }}
        />
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Sort By</h3>
        <Select
          placeholder="Sort products by..."
          className="w-full"
          selectedKeys={[optimizedFilters.sortBy]}
          onSelectionChange={handleSortByChange}
        >
          <SelectItem key="newest">Newest First</SelectItem>
          <SelectItem key="oldest">Oldest First</SelectItem>
          <SelectItem key="price-low">Price: Low to High</SelectItem>
          <SelectItem key="price-high">Price: High to Low</SelectItem>
          <SelectItem key="popular">Most Popular</SelectItem>
        </Select>
      </div>

      {/* Availability & Sales */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Availability & Sales</h3>
        <div className="flex flex-col gap-3">
          <Switch
            color="primary"
            size="sm"
            isSelected={optimizedFilters.inStock}
            onValueChange={setTempInStock}
          >
            Only In Stock
          </Switch>
          <Switch
            color="warning"
            size="sm"
            isSelected={optimizedFilters.onSale}
            onValueChange={setTempOnSale}
          >
            On Sale Only
          </Switch>
        </div>
      </div>

      {/* Item Condition */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Item Condition</h3>
        <Select
          placeholder="Select item condition..."
          className="w-full"
          selectedKeys={[optimizedFilters.itemCondition]}
          onSelectionChange={handleItemConditionChange}
        >
          <SelectItem key="all">All Conditions</SelectItem>
          <SelectItem key="brand-new">Brand New</SelectItem>
          <SelectItem key="like-new">Like New</SelectItem>
          <SelectItem key="very-good">Very Good</SelectItem>
          <SelectItem key="good">Good</SelectItem>
          <SelectItem key="fair">Fair</SelectItem>
        </Select>
      </div>

      {/* Seller Rating Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Seller Rating</h3>
        <Select
          placeholder="Select minimum rating"
          className="w-full"
          selectedKeys={optimizedFilters.sellerRating ? [optimizedFilters.sellerRating.toString()] : []}
          onSelectionChange={handleSellerRatingChange}
        >
          <SelectItem key="4.0">4.0+ stars</SelectItem>
          <SelectItem key="3.5">3.5+ stars</SelectItem>
          <SelectItem key="3.0">3.0+ stars</SelectItem>
          <SelectItem key="2.5">2.5+ stars</SelectItem>
          <SelectItem key="2.0">2.0+ stars</SelectItem>
        </Select>
      </div>

      {/* Location Range Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Location Range</h3>
        <div className="px-2">
          <Slider
            size="md"
            step={5}
            minValue={5}
            maxValue={100}
            value={optimizedFilters.locationRange}
            onChange={handleLocationRangeChange}
            color="warning"
            formatOptions={{
              style: "unit",
              unit: "kilometer",
              unitDisplay: "short"
            }}
            className="max-w-md"
          />
        </div>
        <p className="text-xs text-foreground-500 px-2">
          Show items within {optimizedFilters.locationRange} km
        </p>
      </div>

    </div>
  );
});

export default FiltersList;
