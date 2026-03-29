import { create } from "zustand";

const useGlobalStore = create((set, get) => ({
  accidentAlert: null,
  helmetData: null,

  setAccidentAlert: (alert) => set({ accidentAlert: alert }),
  setHelmetData: (data) =>
    set((state) => ({
      helmetData: {
        ...(state.helmetData || {}),
        ...data,
      },
    })),
}));

export default useGlobalStore;
