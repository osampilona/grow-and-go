"use client";

import { memo, useMemo, useCallback, useEffect } from "react";
import { Slider } from "@heroui/slider";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";

import { useFilterStore } from "../stores/filterStore";
import { useDynamicPriceBounds } from "../utils/pricing";
import { useFeedStore } from "../stores/feedStore";
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
  // New filter actions
  const toggleTempSize = useFilterStore((state) => state.toggleTempSize);
  const toggleTempBrand = useFilterStore((state) => state.toggleTempBrand);
  const toggleTempPetFree = useFilterStore((state) => state.toggleTempPetFree);
  const toggleTempSmokeFree = useFilterStore((state) => state.toggleTempSmokeFree);
  const toggleTempPerfumeFree = useFilterStore((state) => state.toggleTempPerfumeFree);
  const toggleTempShippingMethod = useFilterStore((state) => state.toggleTempShippingMethod);
  const toggleTempBundleDeal = useFilterStore((state) => state.toggleTempBundleDeal);

  // MEMOIZED: Button click handlers with stable references
  const handleBoyClick = useCallback(() => toggleTempGender("Boy"), [toggleTempGender]);
  const handleGirlClick = useCallback(() => toggleTempGender("Girl"), [toggleTempGender]);

  // MEMOIZED: Gender button styles to prevent recalculation
  const boyButtonClass = useMemo(
    () =>
      `flex flex-col items-center px-2 py-1 rounded-lg hover:bg-default-100 focus:outline-none transition-all duration-150 cursor-pointer ` +
      (optimizedFilters.genderState.isBoySelected
        ? "bg-stone-200/80 backdrop-blur-sm dark:bg-white/10 dark:backdrop-blur-sm"
        : ""),
    [optimizedFilters.genderState.isBoySelected]
  );

  const girlButtonClass = useMemo(
    () =>
      `flex flex-col items-center px-2 py-1 rounded-lg hover:bg-default-100 focus:outline-none transition-all duration-150 cursor-pointer ` +
      (optimizedFilters.genderState.isGirlSelected
        ? "bg-stone-200/80 backdrop-blur-sm dark:bg-white/10 dark:backdrop-blur-sm"
        : ""),
    [optimizedFilters.genderState.isGirlSelected]
  );

  // MEMOIZED: Image sources to prevent recalculation
  const boyImageSrc = useMemo(
    () => (optimizedFilters.genderState.isBoySelected ? "/boy.svg" : "/boy_bw.svg"),
    [optimizedFilters.genderState.isBoySelected]
  );

  const girlImageSrc = useMemo(
    () => (optimizedFilters.genderState.isGirlSelected ? "/girl.svg" : "/girl_bw.svg"),
    [optimizedFilters.genderState.isGirlSelected]
  );

  // MEMOIZED: Static style objects to prevent recreation
  const buttonBaseStyle = useMemo(() => ({ minWidth: 66 }), []);
  const imageStyle = useMemo(() => ({ minWidth: 28, minHeight: 28 }), []);

  // MEMOIZED: Other handlers to prevent unnecessary re-renders
  const handleAgeRangeChange = useCallback(
    (value: number | number[]) => {
      setTempAgeRange(Array.isArray(value) ? value : [value]);
    },
    [setTempAgeRange]
  );

  const handlePriceRangeChange = useCallback(
    (value: number | number[]) => {
      setTempPriceRange(Array.isArray(value) ? value : [value]);
    },
    [setTempPriceRange]
  );

  const handleSortByChange = useCallback(
    (keys: any) => {
      setTempSortBy(Array.from(keys)[0] as string);
    },
    [setTempSortBy]
  );

  const handleItemConditionChange = useCallback(
    (keys: any) => {
      setTempItemCondition(Array.from(keys)[0] as string);
    },
    [setTempItemCondition]
  );

  const handleSellerRatingChange = useCallback(
    (keys: any) => {
      const rating = Array.from(keys)[0];

      setTempSellerRating(rating ? parseFloat(rating as string) : null);
    },
    [setTempSellerRating]
  );

  const handleLocationRangeChange = useCallback(
    (value: number | number[]) => {
      setTempLocationRange(Array.isArray(value) ? value[0] : value);
    },
    [setTempLocationRange]
  );

  // New handlers
  const handleSizeToggle = useCallback(
    (size: string) => () => toggleTempSize(size),
    [toggleTempSize]
  );
  const handleBrandToggle = useCallback(
    (brand: string) => () => toggleTempBrand(brand),
    [toggleTempBrand]
  );
  const handleShippingToggle = useCallback(
    (method: string) => () => toggleTempShippingMethod(method),
    [toggleTempShippingMethod]
  );

  // Trigger feed load once (side-effect) for dynamic price bounds
  const loadFeed = useFeedStore((s) => s.loadFeed);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const { maxPrice } = useDynamicPriceBounds();

  // MEMOIZED: Tooltip content to prevent recreating objects
  const ageTooltipContent = useMemo(
    () => `${optimizedFilters.ageRange[0]} - ${optimizedFilters.ageRange[1]} months`,
    [optimizedFilters.ageRange]
  );

  const priceTooltipContent = useMemo(
    () => `DKK ${optimizedFilters.priceRange[0]} - DKK ${optimizedFilters.priceRange[1]}`,
    [optimizedFilters.priceRange]
  );

  // Data lists (memoized)
  const sizeOptions = useMemo(
    () => ["0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M", "2T", "3T", "4T", "5T"],
    []
  );
  const brandOptions = useMemo(
    () => ["Carter's", "H&M", "Nike", "Adidas", "Zara", "GAP", "Next", "Old Navy"],
    []
  );
  const shippingOptions = useMemo(
    () => [
      { key: "pickup", label: "Pickup" },
      { key: "shipping", label: "Shipping" },
      { key: "local-delivery", label: "Local Delivery" },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* === Tier 1: Core Filters === */}
      {/* Gender Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Gender</h3>
        <div className="flex gap-3">
          <button className={boyButtonClass} style={buttonBaseStyle} onClick={handleBoyClick}>
            <img
              alt="Boy"
              className={`w-7 h-7 mb-1 object-contain transition-all duration-150 ${
                optimizedFilters.genderState.isBoySelected ? "" : "dark:invert"
              }`}
              src={boyImageSrc}
              style={imageStyle}
            />
            <span className="text-xs font-semibold text-foreground">Boy</span>
          </button>

          <button className={girlButtonClass} style={buttonBaseStyle} onClick={handleGirlClick}>
            <img
              alt="Girl"
              className={`w-7 h-7 mb-1 object-contain transition-all duration-150 ${
                optimizedFilters.genderState.isGirlSelected ? "" : "dark:invert"
              }`}
              src={girlImageSrc}
              style={imageStyle}
            />
            <span className="text-xs font-semibold text-foreground">Girl</span>
          </button>
        </div>
      </div>
      {/* Age Range Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">Age Range (months)</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary tracking-tight">
            {optimizedFilters.ageRange[0]}–{optimizedFilters.ageRange[1]}m
          </span>
        </div>
        <Slider
          className="w-full"
          color="primary"
          maxValue={60}
          minValue={0}
          showTooltip={true}
          step={1}
          tooltipProps={{
            content: ageTooltipContent,
          }}
          value={optimizedFilters.ageRange}
          onChange={handleAgeRangeChange}
        />
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">Price Range</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary tracking-tight">
            DKK {optimizedFilters.priceRange[0]}–{optimizedFilters.priceRange[1]}
          </span>
        </div>
        <Slider
          className="w-full"
          color="secondary"
          maxValue={maxPrice}
          minValue={0}
          showTooltip={true}
          step={5}
          tooltipProps={{
            content: priceTooltipContent,
          }}
          value={optimizedFilters.priceRange}
          onChange={handlePriceRangeChange}
        />
      </div>

      {/* Sizes */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((sz) => {
            const selected = optimizedFilters.sizes?.includes(sz);

            return (
              <button
                key={sz}
                className={`px-2 py-1 text-xs rounded-md border transition-colors ${selected ? "bg-primary text-white border-primary" : "border-default-200 hover:bg-default-100"}`}
                onClick={handleSizeToggle(sz)}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* === Tier 2: Important Secondary === */}
      {/* Item Condition */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Item Condition</h3>
        <Select
          className="w-full"
          placeholder="Select item condition..."
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

      {/* Brands */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Brands</h3>
        <div className="flex flex-wrap gap-2">
          {brandOptions.map((brand) => {
            const selected = optimizedFilters.brands?.includes(brand);

            return (
              <button
                key={brand}
                className={`px-2 py-1 text-xs rounded-md border transition-colors ${selected ? "bg-secondary text-white border-secondary" : "border-default-200 hover:bg-default-100"}`}
                onClick={handleBrandToggle(brand)}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability & Sales */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Availability & Sales</h3>
        <div className="flex flex-col gap-3">
          <Switch
            color="primary"
            isSelected={optimizedFilters.inStock}
            size="sm"
            onValueChange={setTempInStock}
          >
            Only In Stock
          </Switch>
          <Switch
            color="warning"
            isSelected={optimizedFilters.onSale}
            size="sm"
            onValueChange={setTempOnSale}
          >
            On Sale Only
          </Switch>
        </div>
      </div>

      {/* === Tier 3: Situational / Specific === */}
      {/* Shipping / Delivery Methods */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Delivery Methods</h3>
        <div className="flex flex-wrap gap-2">
          {shippingOptions.map((opt) => {
            const selected = optimizedFilters.shippingMethods?.includes(opt.key);

            return (
              <button
                key={opt.key}
                className={`px-2 py-1 text-xs rounded-md border transition-colors ${selected ? "bg-warning text-black border-warning" : "border-default-200 hover:bg-default-100"}`}
                onClick={handleShippingToggle(opt.key)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Range Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Location Range</h3>
        <div className="px-2">
          <Slider
            className="max-w-md"
            color="warning"
            formatOptions={{
              style: "unit",
              unit: "kilometer",
              unitDisplay: "short",
            }}
            maxValue={100}
            minValue={0}
            size="md"
            step={5}
            value={optimizedFilters.locationRange}
            onChange={handleLocationRangeChange}
          />
        </div>
        <p className="text-xs text-foreground-500 px-2">
          Show items within {optimizedFilters.locationRange} km
        </p>
      </div>

      {/* Seller Rating Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Seller Rating</h3>
        <Select
          className="w-full"
          placeholder="Select minimum rating"
          selectedKeys={
            optimizedFilters.sellerRating ? [optimizedFilters.sellerRating.toString()] : []
          }
          onSelectionChange={handleSellerRatingChange}
        >
          <SelectItem key="4.0">4.0+ stars</SelectItem>
          <SelectItem key="3.5">3.5+ stars</SelectItem>
          <SelectItem key="3.0">3.0+ stars</SelectItem>
          <SelectItem key="2.5">2.5+ stars</SelectItem>
          <SelectItem key="2.0">2.0+ stars</SelectItem>
        </Select>
      </div>

      {/* === Tier 4: Niche / Sorting === */}
      {/* Environment & Hygiene */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Environment & Hygiene</h3>
        <div className="flex flex-col gap-3">
          <Switch
            color="success"
            isSelected={optimizedFilters.petFree}
            size="sm"
            onValueChange={toggleTempPetFree}
          >
            Pet Free Home
          </Switch>
          <Switch
            color="success"
            isSelected={optimizedFilters.smokeFree}
            size="sm"
            onValueChange={toggleTempSmokeFree}
          >
            Smoke Free Home
          </Switch>
          <Switch
            color="success"
            isSelected={optimizedFilters.perfumeFree}
            size="sm"
            onValueChange={toggleTempPerfumeFree}
          >
            Perfume Free
          </Switch>
        </div>
      </div>

      {/* Bundle Deal */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Deals</h3>
        <Switch
          color="secondary"
          isSelected={optimizedFilters.bundleDeal}
          size="sm"
          onValueChange={toggleTempBundleDeal}
        >
          Bundle Deal Available
        </Switch>
      </div>

      {/* Sort By (bottom) */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Sort By</h3>
        <Select
          className="w-full"
          placeholder="Sort products by..."
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
    </div>
  );
});

export default FiltersList;
