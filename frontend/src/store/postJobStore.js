import { create } from 'zustand';

const usePostJobStore = create((set) => ({
  // Step 1
  title: '',
  category: 'Natural Language Processing',
  timelineAmount: '',
  timelineUnit: 'Tháng',
  description: '',
  // Step 2
  selectedPackage: 'basic',
  // AI results
  generatedPRD: '',
  suggestedExperts: [],

  updateStep1: (fields) => set(fields),
  updateStep2: (fields) => set(fields),
  setAIResults: ({ prd, experts }) => set({ generatedPRD: prd, suggestedExperts: experts }),
  reset: () =>
    set({
      title: '',
      category: 'Natural Language Processing',
      timelineAmount: '',
      timelineUnit: 'Tháng',
      description: '',
      selectedPackage: 'basic',
      generatedPRD: '',
      suggestedExperts: [],
    }),
}));

export default usePostJobStore;
