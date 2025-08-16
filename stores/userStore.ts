import type { SellerProfilesMap, SellerProfile, SellerStylePreferences } from "@/types/seller";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { mockSellerProfiles } from "@/data/mock/sellers";

export type SellerTier = "freemium" | "premium";

export interface FollowingState {
  following: Record<string, true>;
  isFollowing: (userId: string) => boolean;
  follow: (userId: string) => void;
  unfollow: (userId: string) => void;
  loadRemote: () => Promise<void>; // Attempt to sync from API (optional)
  saveRemote: (userId: string, follow: boolean) => Promise<void>;
}

export interface SessionState {
  currentUserId?: string; // buyer id
  sellerTiers: Record<string, SellerTier>; // sellerId -> tier
  loadingTiers: boolean;
  setTier: (sellerId: string, tier: SellerTier) => void;
  setCurrentUser: (userId: string | undefined) => void;
  loadTiers: () => Promise<void>;
  saveTiers: () => Promise<void>;
  // Extended seller preference profiles
  sellerProfiles: SellerProfilesMap;
  setSellerProfile: (profile: SellerProfile) => void;
  upsertSellerPreferences: (
    sellerId: string,
    mutator: (prev: SellerStylePreferences | undefined) => SellerStylePreferences
  ) => void;
  loadSellerProfiles: () => Promise<void>;
  saveSellerProfiles: () => Promise<void>;
}

export const useFollowingStore = create<FollowingState>()(
  persist(
    (set, get) => ({
      following: {},
      isFollowing: (userId: string) => !!get().following[userId],
      follow: (userId: string) => {
        set((s) => ({ following: { ...s.following, [userId]: true } }));
        void get().saveRemote(userId, true);
      },
      unfollow: (userId: string) => {
        set((s) => {
          const next = { ...s.following };

          delete next[userId];

          return { following: next };
        });
        void get().saveRemote(userId, false);
      },
      async loadRemote() {
        try {
          const res = await fetch("/api/following", { cache: "no-store" });

          if (!res.ok) return;

          const data = await res.json();
          const map: Record<string, true> = {};

          (data.followingIds as string[] | undefined)?.forEach((id) => {
            map[id] = true;
          });

          set({ following: map });
        } catch {}
      },
      async saveRemote(userId: string, follow: boolean) {
        try {
          await fetch("/api/following", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, follow }),
          });
        } catch {}
      },
    }),
    {
      name: "following-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ following: s.following }),
    }
  )
);

// Provide some demo defaults for tiers (can be overridden by API)
const defaultTiers: Record<string, SellerTier> = {
  "1": "premium",
  "2": "freemium",
  "3": "premium",
  "4": "freemium",
  "5": "freemium",
  "6": "premium",
};

export const useSessionStore = create<SessionState>((set, get) => ({
  currentUserId: undefined,
  sellerTiers: defaultTiers,
  loadingTiers: false,
  sellerProfiles: mockSellerProfiles,
  setTier: (sellerId: string, tier: SellerTier) =>
    set((s) => ({ sellerTiers: { ...s.sellerTiers, [sellerId]: tier } })),
  setCurrentUser: (userId?: string) => set(() => ({ currentUserId: userId })),
  async loadTiers() {
    if (get().loadingTiers) return;
    set({ loadingTiers: true });
    try {
      const res = await fetch("/api/sellers/tiers", { cache: "no-store" });

      if (!res.ok) {
        set({ loadingTiers: false });

        return;
      }

      const data = await res.json();

      if (data && typeof data === "object" && data.tiers) {
        set({ sellerTiers: { ...defaultTiers, ...data.tiers } });
      }
    } catch {
      // ignore
    } finally {
      set({ loadingTiers: false });
    }
  },
  async saveTiers() {
    try {
      const tiers = get().sellerTiers;

      await fetch("/api/sellers/tiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tiers }),
      });
    } catch {}
  },
  setSellerProfile(profile) {
    set((s) => ({ sellerProfiles: { ...s.sellerProfiles, [profile.sellerId]: profile } }));
  },
  upsertSellerPreferences(sellerId, mutator) {
    set((s) => {
      const existing = s.sellerProfiles[sellerId]?.preferences;
      const next = mutator(existing);

      return {
        sellerProfiles: {
          ...s.sellerProfiles,
          [sellerId]: { sellerId, preferences: next },
        },
      };
    });
  },
  async loadSellerProfiles() {
    try {
      const res = await fetch("/api/sellers/profiles", { cache: "no-store" });

      if (!res.ok) return;

      const data = await res.json();

      if (data && data.profiles) {
        set((s) => ({ sellerProfiles: { ...s.sellerProfiles, ...data.profiles } }));
      }
    } catch {}
  },
  async saveSellerProfiles() {
    try {
      const profiles = get().sellerProfiles;

      await fetch("/api/sellers/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profiles }),
      });
    } catch {}
  },
}));
