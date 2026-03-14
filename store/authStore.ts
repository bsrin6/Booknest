import { create } from 'zustand';

interface AuthState {
    phoneNumber: string;
    countryCode: string;
    otp: string[];
    parentName: string;
    email: string;
    city: string;
    isLoading: boolean;
    isAuthenticated: boolean;
    isProfileComplete: boolean;
    confirmationResult: any | null;

    // Actions
    setPhoneNumber: (phone: string) => void;
    setCountryCode: (code: string) => void;
    setOtp: (otp: string[]) => void;
    setParentName: (name: string) => void;
    setEmail: (email: string) => void;
    setCity: (city: string) => void;
    setLoading: (loading: boolean) => void;
    setAuthenticated: (auth: boolean) => void;
    setProfileComplete: (complete: boolean) => void;
    setConfirmationResult: (result: any | null) => void;
    resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    phoneNumber: '',
    countryCode: '+91',
    otp: ['', '', '', '', '', ''],
    parentName: '',
    email: '',
    city: '',
    isLoading: false,
    isAuthenticated: false,
    isProfileComplete: false,
    confirmationResult: null,

    setPhoneNumber: (phone) => set({ phoneNumber: phone }),
    setCountryCode: (code) => set({ countryCode: code }),
    setOtp: (otp) => set({ otp }),
    setParentName: (name) => set({ parentName: name }),
    setEmail: (email) => set({ email }),
    setCity: (city) => set({ city }),
    setLoading: (loading) => set({ isLoading: loading }),
    setAuthenticated: (auth) => set({ isAuthenticated: auth }),
    setProfileComplete: (complete) => set({ isProfileComplete: complete }),
    setConfirmationResult: (result) => set({ confirmationResult: result }),
    resetAuth: () =>
        set({
            phoneNumber: '',
            otp: ['', '', '', '', '', ''],
            parentName: '',
            email: '',
            city: '',
            isLoading: false,
            isAuthenticated: false,
            isProfileComplete: false,
            confirmationResult: null,
        }),
}));
