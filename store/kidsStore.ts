import { create } from 'zustand';

export interface Kid {
    id: string;
    name: string;
    school: string;
    className: string;
    section: string;
    curriculum: string;
    city: string;
    avatar: string | null;
}

interface KidsState {
    kids: Kid[];
    selectedKidId: string | null;
    addKid: (kid: Omit<Kid, 'id'>) => void;
    removeKid: (id: string) => void;
    updateKid: (id: string, kid: Partial<Kid>) => void;
    selectKid: (id: string) => void;
}

export const useKidsStore = create<KidsState>((set) => ({
    kids: [
        {
            id: '1',
            name: 'Aiden Smith',
            school: 'Greenwood Elementary',
            className: '4',
            section: 'B',
            curriculum: 'CBSC/Pinacle',
            city: 'Mumbai',
            avatar: 'boy',
        },
        {
            id: '2',
            name: 'Maya Johnson',
            school: 'Greenwood Elementary',
            className: '1',
            section: 'A',
            curriculum: 'State/Lead',
            city: 'Mumbai',
            avatar: 'girl',
        },
    ],
    selectedKidId: '1',

    addKid: (kid) =>
        set((state) => ({
            kids: [
                ...state.kids,
                { ...kid, id: Date.now().toString() },
            ],
        })),

    removeKid: (id) =>
        set((state) => ({
            kids: state.kids.filter((k) => k.id !== id),
        })),

    updateKid: (id, updates) =>
        set((state) => ({
            kids: state.kids.map((k) => (k.id === id ? { ...k, ...updates } : k)),
        })),

    selectKid: (id) => set({ selectedKidId: id }),
}));
