import { create } from "zustand";

export const useModalStore = create((set) => ({
  isOpen: false,
  type: null,      // "success" | "error" | "warning"
  message: "",
  extraData: null, // optional

  openModal: (data) =>
    set({
      isOpen: true,
      type: data.type,
      message: data.message,
      extraData: data.extraData || null,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      type: null,
      message: "",
      extraData: null,
    }),
}));