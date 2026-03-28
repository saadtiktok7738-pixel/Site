import React from "react";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1, color) => {
        const existing = get().items.find(i => i.productId === product.id && i.color === (color || ""));
        if (existing) {
          set({
            items: get().items.map(i =>
              i.productId === product.id && i.color === (color || "")
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          });
        } else {
          set({
            items: [...get().items, {
              productId: product.id,
              productName: product.name,
              price: product.price,
              quantity,
              imageUrl: product.imageUrl,
              color: color || "",
            }]
          });
        }
      },
      removeFromCart: (productId) => set({
        items: get().items.filter(i => i.productId !== productId)
      }),
      updateQuantity: (productId, quantity) => set({
        items: get().items.map(i => i.productId === productId ? { ...i, quantity } : i)
      }),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
    }),
    { name: 'ecommerce-cart' }
  )
);

// useWishlist.js

export const useWishlist = create(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => {
        const exists = get().items.some(i => i.id === product.id);
        if (exists) {
          set({ items: get().items.filter(i => i.id !== product.id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },
      isInWishlist: (productId) => get().items.some(i => i.id === productId)
    }),
    { name: 'ecommerce-wishlist' }
  )
);

// useAuth.js

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

// useUI.js

export const useUI = create((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isLoginModalOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setLoginModalOpen: (open) => set({ isLoginModalOpen: open })
}));

// useIsMobile.js

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// useToast.js

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

let count = 0;
function genId() { count = (count + 1) % Number.MAX_SAFE_INTEGER; return count.toString(); }

let memoryState = { toasts: [] };
const listeners = [];
const toastTimeouts = new Map();

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach(fn => fn(memoryState));
}

const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state, action) => {
  switch(action.type){
    case "ADD_TOAST": return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "UPDATE_TOAST": return { ...state, toasts: state.toasts.map(t => t.id === action.toast.id ? { ...t, ...action.toast } : t) };
    case "DISMISS_TOAST": {
      if (action.toastId) addToRemoveQueue(action.toastId);
      else state.toasts.forEach(t => addToRemoveQueue(t.id));
      return { ...state, toasts: state.toasts.map(t => t.id === action.toastId || !action.toastId ? { ...t, open: false } : t) };
    }
    case "REMOVE_TOAST":
      return action.toastId ? { ...state, toasts: state.toasts.filter(t => t.id !== action.toastId) } : { ...state, toasts: [] };
    default: return state;
  }
};

export function toast({ ...props }) {
  const id = genId();
  const update = (props) => dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) dismiss() } } });
  return { id, dismiss, update };
}

export function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => { const i = listeners.indexOf(setState); if(i>-1) listeners.splice(i,1); }
  }, [state]);
  return { ...state, toast, dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }) };
}