import { create } from "zustand";

interface CartQuantityStore {
  totalQuantity: number;
  setTotalQuantity: (quantity: number) => void;
  resetTotalQuantity: () => void;
  incrementQuantity: (amount: number) => void;
  decrementQuantity: (amount: number) => void;
}

export const useCartQuantityStore = create<CartQuantityStore>()((set) => ({
  totalQuantity: 0,
  setTotalQuantity: (quantity: number) =>
    set(() => ({ totalQuantity: quantity })),
  resetTotalQuantity: () => set(() => ({ totalQuantity: 0 })),
  incrementQuantity: (amount: number) =>
    set((state) => ({ totalQuantity: state.totalQuantity + amount })),
  decrementQuantity: (amount: number) =>
    set((state) => ({
      totalQuantity: Math.max(0, state.totalQuantity - amount),
    })),
}));
