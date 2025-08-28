export type TipsMap = Record<string, string[]>;

// Demo buyer tips per seller userId (what a buyer should check/know for this seller's items)
export const mockTips: TipsMap = {
  // User 1: Buyer-focused tips
  "1": [
    "All items are in good condition and have been cleaned before listing.",
    "Some shirts are completely new.",
  ],
  // User 2: Buyer-focused tips
  "2": ["A bit of a color peel, but otherwise in great condition."],
  // User 3 explicitly has no tips to demonstrate the empty state
  "3": [],
};
