import { create } from "zustand";

type useNewPetStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewPet = create<useNewPetStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
