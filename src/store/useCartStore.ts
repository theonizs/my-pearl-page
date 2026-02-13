"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { env } from "@/lib/config"; // ดึงจากจุดศูนย์กลางที่เราทำไว้

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  metadata?: {
    pearlType?: string; // เช่น Akoya, South Sea
    length?: string;    // เช่น 16", 18"
  };
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // ย้ายการคำนวณมาเป็น State เพื่อให้เรียกใช้ง่ายและ Performance ดีกว่า
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: env.NEXT_PUBLIC_CART_STORAGE_KEY, // ใช้ค่าที่ผ่านการ Validate แล้ว
    }
  )
);