import { create } from 'zustand';

export interface Address {
    parentName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
}

interface AddressState {
    address: Address | null;
    setAddress: (address: Address) => void;
}

export const useAddressStore = create<AddressState>((set) => ({
    address: null,
    setAddress: (address) => set({ address }),
}));
