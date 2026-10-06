import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardSize = "normal" | "large";

interface ViewStore {
  cardSize: CardSize;
  setCardSize: (cardSize: CardSize) => void;
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      cardSize: "normal",
      setCardSize: (cardSize) => set({ cardSize }),
    }),
    {
      name: "umcine-view-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
