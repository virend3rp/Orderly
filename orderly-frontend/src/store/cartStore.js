import { create } from 'zustand';

const useCartStore = create((set) => ({
  items: [],
  isCartOpen: false, // NEW: State to manage drawer visibility

  // NEW: Action to toggle the drawer
  toggleCart: () => {
    set((state) => ({ isCartOpen: !state.isCartOpen }));
  },
  
  addToCart: (product) => {
    set((state) => {
      const itemInCart = state.items.find((item) => item.id === product.id);
      if (itemInCart) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      } else {
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },
  clearCart: () => {
    set({ items: [] });
  },
}));

export default useCartStore;