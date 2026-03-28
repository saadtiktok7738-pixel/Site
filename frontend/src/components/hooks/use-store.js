import React, { useState, useEffect } from "react";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------- Cart Store ----------------
export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1, color) => set((state) => {
        const existing = state.items.find(i => i.productId === product.id && i.color === (color || ""));
        if (existing) {
          return {
            items: state.items.map(i =>
              i.productId === product.id && i.color === (color || "")
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          };
        }
        return {
          items: [...state.items, {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl,
            color: color || "",
          }]
        };
      }),
      removeFromCart: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(i => i.productId === productId ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    { name: 'ecommerce-cart' }
  )
);

// ---------------- Wishlist Store ----------------
export const useWishlist = create(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => set((state) => {
        const exists = state.items.some(i => i.id === product.id);
        if (exists) {
          return { items: state.items.filter(i => i.id !== product.id) };
        }
        return { items: [...state.items, product] };
      }),
      isInWishlist: (productId) => get().items.some(i => i.id === productId)
    }),
    { name: 'ecommerce-wishlist' }
  )
);

// ---------------- Auth Store ----------------
export const useAuth = create(
  persist(
    (set) => ({
      adminToken: null,
      adminUser: null,
      userToken: null,
      currentUser: null,
      setAuth: (token, user) => set({ adminToken: token, adminUser: user }),
      logout: () => set({ adminToken: null, adminUser: null }),
      setUserAuth: (token, user) => set({ userToken: token, currentUser: user }),
      logoutUser: () => set({ userToken: null, currentUser: null }),
    }),
    { name: 'ecommerce-auth' }
  )
);

// ---------------- UI Store ----------------
export const useUI = create((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isLoginModalOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),
}));