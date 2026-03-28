import { create } from "zustand";

const useGlobalStore = create((set, get) => ({
  accidentAlert: null,

  setAccidentAlert: (alert) => set({ accidentAlert: alert }),
}));

export default useGlobalStore;
