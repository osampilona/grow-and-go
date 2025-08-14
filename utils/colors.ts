import { categories, subcategoryMap } from "@/stores/categoryStore";

export type ChipColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

// Base palette used to assign category colors deterministically by order (excluding 'everything')
const PALETTE: ChipColor[] = ["primary", "secondary", "success", "warning", "danger"];

// Build a stable map from categoryId -> color
const CATEGORY_COLOR_MAP: Record<string, ChipColor> = (() => {
  const map: Record<string, ChipColor> = { everything: "default" };
  const filtered = categories.filter((c) => c.id !== "everything");

  filtered.forEach((cat, idx) => {
    map[cat.id] = PALETTE[idx % PALETTE.length];
  });

  return map;
})();

export function getCategoryColor(categoryId: string | undefined): ChipColor {
  if (!categoryId) return "default";

  return CATEGORY_COLOR_MAP[categoryId] ?? "default";
}

export function getSubcategoryColor(subcategoryId: string | undefined): ChipColor {
  if (!subcategoryId) return "default";
  for (const [catId, subs] of Object.entries(subcategoryMap)) {
    if (subs.some((s) => s.id === subcategoryId)) {
      return getCategoryColor(catId);
    }
  }

  return "default";
}

// Filter group color map: keep consistent colors per filter group
const FILTER_GROUP_COLOR: Record<string, ChipColor> = {
  gender: "secondary",
  age: "primary",
  price: "primary",
  size: "success",
  condition: "success",
  brand: "secondary",
  availability: "default",
  sale: "warning",
  shipping: "warning",
  location: "warning",
  rating: "warning",
  environment: "success",
  deal: "secondary",
  sort: "primary",
};

export function getFilterGroupColor(group: keyof typeof FILTER_GROUP_COLOR): ChipColor {
  return FILTER_GROUP_COLOR[group];
}

// Dark theme visibility helpers for Chips
// Use these to ensure good contrast in dark mode while preserving color coding.
// Apply by spreading the returned props into <Chip ... /> components.
const DARK_CHIP_BG: Record<ChipColor, string> = {
  default: "dark:!bg-slate-600",
  primary: "dark:!bg-blue-600",
  secondary: "dark:!bg-purple-600",
  success: "dark:!bg-emerald-600",
  warning: "dark:!bg-amber-600",
  danger: "dark:!bg-rose-600",
};

function darkChipClass(color: ChipColor): string {
  return `${DARK_CHIP_BG[color]} dark:!text-white`;
}

export function getFilterChipProps(group: keyof typeof FILTER_GROUP_COLOR): {
  color: ChipColor;
  className: string;
} {
  const color = getFilterGroupColor(group);

  return { color, className: darkChipClass(color) };
}

export function getCategoryChipProps(categoryId: string | undefined): {
  color: ChipColor;
  className: string;
} {
  const color = getCategoryColor(categoryId);

  return { color, className: darkChipClass(color) };
}

export function getSubcategoryChipProps(subcategoryId: string | undefined): {
  color: ChipColor;
  className: string;
} {
  const color = getSubcategoryColor(subcategoryId);

  return { color, className: darkChipClass(color) };
}
