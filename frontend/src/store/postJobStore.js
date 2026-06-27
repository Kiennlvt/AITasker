import { create } from 'zustand';

const BUDGET_TO_PACKAGE = { 1000: 'basic', 5000: 'standard', 15000: 'premium' };

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
      category: draft.skills?.[0] || 'Natural Language Processing',
      description: draft.description || '',
      selectedPackage: BUDGET_TO_PACKAGE[draft.budget] || 'basic',
      generatedPRD: draft.description || '',
      suggestedExperts: [],
      timelineAmount: '',
      timelineUnit: 'Tháng',
    }),

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
      draftId: null,
      jobStatus: null,
    }),
}));

export default usePostJobStore;
