import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LikeState {
  likedIds: Record<string, true>;
  hasHydrated: boolean;
  // Actions
  toggleLike: (id: string) => void;
  like: (id: string) => void;
  unlike: (id: string) => void;
  clearLikes: () => void;
  isLiked: (id: string) => boolean;
  getLikedIds: () => string[];
  setHasHydrated: (v: boolean) => void;
  // Backend sync
  syncFromServer: () => Promise<void>;
}

export const useLikeStore = create<LikeState>()(
  persist(
    (set, get) => ({
      likedIds: {},
      hasHydrated: false,
      toggleLike: (id: string) =>
        set((state) => {
          const next = { ...state.likedIds };

          if (next[id]) {
            delete next[id];
          } else {
            next[id] = true;
          }

          return { likedIds: next };
        }),
      like: (id: string) => set((state) => ({ likedIds: { ...state.likedIds, [id]: true } })),
      unlike: (id: string) =>
        set((state) => {
          const next = { ...state.likedIds };

          delete next[id];

          return { likedIds: next };
        }),
      clearLikes: () => set(() => ({ likedIds: {} })),
      isLiked: (id: string) => {
        const { likedIds } = get();

        return !!likedIds[id];
      },
      getLikedIds: () => Object.keys(get().likedIds),
      setHasHydrated: (v: boolean) => set(() => ({ hasHydrated: v })),
      async syncFromServer() {
        try {
          const res = await fetch("/api/favorites", { cache: "no-store" });

          if (!res.ok) return;
          const data = await res.json();
          const ids: string[] = Array.isArray(data?.ids) ? data.ids.map(String) : [];
          const map: Record<string, true> = {};

          ids.forEach((id) => {
            map[id] = true;
          });
          set({ likedIds: map });
        } catch {
          // noop
        }
      },
    }),
    {
      name: "like-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ likedIds: state.likedIds }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
