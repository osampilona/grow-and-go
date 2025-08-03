"use client";

import { memo } from "react";
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
  const clearAllTempFilters = useFilterStore((state) => state.clearAllTempFilters);

  const brands = [
    "Fisher-Price",
    "Carter's", 
    "Pampers",
    "Gerber",
    "Baby Einstein",
    "Skip Hop",
    "Chicco",
    "Graco"
  ];

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
          onChange={(value) => setTempAgeRange(Array.isArray(value) ? value : [value])}
          className="w-full"
          color="primary"
          showTooltip={true}
          tooltipProps={{
            content: `${tempFilters.ageRange[0]} - ${tempFilters.ageRange[1]} months`
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
          onChange={(value) => setTempPriceRange(Array.isArray(value) ? value : [value])}
          className="w-full"
          color="secondary"
          showTooltip={true}
          tooltipProps={{
            content: `$${tempFilters.priceRange[0]} - $${tempFilters.priceRange[1]}`
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
          onSelectionChange={(keys) => setTempSortBy(Array.from(keys)[0] as string)}
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
