import { create } from 'zustand';

interface OnboardingData {
  // Step 1: Business
  name: string;
  ownerName: string;
  phone: string;
  // Step 2: Location
  location: { coordinates: [number, number]; address: string } | null;
  // Step 3: Services
  services: string[];
  // Step 4: Photos
  photos: File[];
  // Step 5: KYC
  kycAadhar: File | null;
  kycShopAct: File | null;
}

interface OnboardingStore {
  currentStep: number;
  data: OnboardingData;
  setStep: (step: number) => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  reset: () => void;
}

const defaultData: OnboardingData = {
  name: '', ownerName: '', phone: '',
  location: null,
  services: [],
  photos: [],
  kycAadhar: null, kycShopAct: null,
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: 1,
  data: defaultData,
  setStep: (step) => set({ currentStep: step }),
  updateData: (partial) => set((state) => ({ data: { ...state.data, ...partial } })),
  reset: () => set({ currentStep: 1, data: defaultData }),
}));
