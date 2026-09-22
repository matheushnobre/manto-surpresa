import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cartItem";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  changeQuantity: (item: CartItem, value: number) => void;
  removeItem: (item: CartItem) => void;
}

export const userCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const exists = state.items.some(
            (i) => i.id === item.id && i.size === item.size,
          );

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      changeQuantity: (item, value) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: i.quantity + value }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      removeItem: (item) =>
        set((state) => ({
          items: state.items.filter(
            (x) => x.id !== item.id || x.size !== item.size,
          ),
        })),
    }),

    {
      name: "cart-storage",
    },
  ),
);
