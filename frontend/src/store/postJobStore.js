import { create } from 'zustand';

const BUDGET_TO_PACKAGE = { 1000: 'basic', 5000: 'standard', 15000: 'premium' };

const usePostJobStore = create((set) => ({
  // Step 1
  title: '',
  category: '',
  timelineAmount: '',
  timelineUnit: 'Months',
  description: '',
  // Step 2
  selectedPackage: 'basic',
  // AI results
  generatedPRD: '',
  suggestedExperts: [],
  // Draft editing
  draftId: null,
  jobStatus: null,

  updateStep1: (fields) => set(fields),
  updateStep2: (fields) => set(fields),
  setAIResults: ({ prd, experts }) => set({ generatedPRD: prd, suggestedExperts: experts }),

  loadDraft: (draft) =>
    set({
      draftId: draft.id,
      jobStatus: draft.status || 'DRAFT',
      title: draft.title || '',
      category: draft.category || draft.skills?.[0] || '',
      description: draft.description || '',
      selectedPackage: BUDGET_TO_PACKAGE[draft.budget] || 'basic',
      generatedPRD: draft.description || '',
      suggestedExperts: [],
      timelineAmount: '',
      timelineUnit: 'Months',
    }),

  reset: () =>
    set({
      title: '',
      category: '',
      timelineAmount: '',
      timelineUnit: 'Months',
      description: '',
      selectedPackage: 'basic',
      generatedPRD: '',
      suggestedExperts: [],
      draftId: null,
      jobStatus: null,
    }),
}));

export default usePostJobStore;