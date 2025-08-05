"use client";

import { memo, useMemo, useCallback } from "react";
import { Slider } from "@heroui/slider";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { useFilterStore } from "../stores/filterStore";

const FiltersList = memo(function FiltersList() {
  const tempFilters = useFilterStore((state) => state.tempFilters);
  const setTempAgeRange = useFilterStore((state) => state.setTempAgeRange);
  const setTempPriceRange = useFilterStore((state) => state.setTempPriceRange);
  const setTempSelectedBrands = useFilterStore((state) => state.setTempSelectedBrands);
  const setTempSortBy = useFilterStore((state) => state.setTempSortBy);
  const setTempInStock = useFilterStore((state) => state.setTempInStock);
  const setTempOnSale = useFilterStore((state) => state.setTempOnSale);
  const setTempItemCondition = useFilterStore((state) => state.setTempItemCondition);
  const setTempSellerRating = useFilterStore((state) => state.setTempSellerRating);
  const setTempLocationRange = useFilterStore((state) => state.setTempLocationRange);
  const clearAllTempFilters = useFilterStore((state) => state.clearAllTempFilters);

  // MEMOIZED: Static brands array to prevent recreation
  const brands = useMemo(() => [
    "Fisher-Price",
    "Carter's", 
    "Pampers",
    "Gerber",
    "Baby Einstein",
    "Skip Hop",
    "Chicco",
    "Graco"
  ], []);

  // MEMOIZED: Handlers to prevent unnecessary re-renders
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
    `${tempFilters.ageRange[0]} - ${tempFilters.ageRange[1]} months`, 
    [tempFilters.ageRange]
  );

  const priceTooltipContent = useMemo(() => 
    `$${tempFilters.priceRange[0]} - $${tempFilters.priceRange[1]}`, 
    [tempFilters.priceRange]
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Age Range Slider */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Age Range (months)</h3>
        <Slider
          label="Age"
          step={1}
          minValue={0}
          maxValue={60}
          value={tempFilters.ageRange}
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
          value={tempFilters.priceRange}
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
          selectedKeys={[tempFilters.sortBy]}
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
            isSelected={tempFilters.inStock}
            onValueChange={setTempInStock}
          >
            Only In Stock
          </Switch>
          <Switch
            color="warning"
            size="sm"
            isSelected={tempFilters.onSale}
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
          selectedKeys={[tempFilters.itemCondition]}
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
          selectedKeys={tempFilters.sellerRating ? [tempFilters.sellerRating.toString()] : []}
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
            value={tempFilters.locationRange}
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
          Show items within {tempFilters.locationRange} km
        </p>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Brands</h3>
        <CheckboxGroup
          color="primary"
          value={tempFilters.selectedBrands}
          onValueChange={setTempSelectedBrands}
        >
          {brands.map((brand) => (
            <Checkbox key={brand} value={brand}>
              {brand}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );
});

export default FiltersList;
