import { create } from "zustand";

interface PlayerTrack {
  id: string;
  title: string | null;
  url: string | null;
  artwork?: string | null;
  prompt: string | null;
  createdByUserName: string | null;
  createdByUserId?: string;
  createdByUserHandle?: string;
}

interface PlayerState {
  track: PlayerTrack | null;
  setTrack: (track: PlayerTrack) => void;
  clearTrack: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  track: null,
  setTrack: (track) => set({ track }),
  clearTrack: () => set({ track: null }),
}));
