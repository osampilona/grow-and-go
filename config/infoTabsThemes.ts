export const infoTabsThemes = {
  blue: { bg: "#2B7FFF", fg: "#FFFFFF" },
  yellow: { bg: "#FFE020", fg: "#000000" },
  // Add more themes here as needed, e.g.:
  // green: { bg: "#10B981", fg: "#FFFFFF" },
  // red: { bg: "#EF4444", fg: "#FFFFFF" },
} as const;

export type InfoTabsThemeKey = keyof typeof infoTabsThemes;

export function resolveInfoTabsTheme(key: InfoTabsThemeKey) {
  return infoTabsThemes[key];
}
