import { create } from 'zustand';

export interface CartItem {
    id: string;
    bundleId: string;
    title: string;
    className: string;
    childName: string;
    price: number;
    image: any;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.bundleId === newItem.bundleId && item.childName === newItem.childName);

        if (existingItem) {
            set({
                items: currentItems.map(item =>
                    (item.bundleId === newItem.bundleId && item.childName === newItem.childName)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            });
        } else {
            set({ items: [...currentItems, { ...newItem, quantity: 1, id: `${newItem.bundleId}-${Date.now()}` }] });
        }
    },
    removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
    })),
    updateQuantity: (id, delta) => set((state) => ({
        items: state.items.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        )
    })),
    clearCart: () => set({ items: [] }),
    getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
    getSubtotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
}));
