import { create } from "zustand";

type ExitModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useExitModal = create<ExitModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
