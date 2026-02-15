import { create } from "zustand";

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmButtonClassName?: string;
  openModal: (params: {
    title: string;
    description: string;
    onConfirm: () => void;
    confirmButtonClassName?: string;
  }) => void;
  closeModal: () => void;
}

export const useConfirmModal = create<ConfirmModalState>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  onConfirm: () => {},
  confirmButtonClassName: "",
  openModal: ({ title, description, onConfirm, confirmButtonClassName }) =>
    set({
      isOpen: true,
      title,
      description,
      onConfirm,
      confirmButtonClassName,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      title: "",
      description: "",
      onConfirm: () => {},
      confirmButtonClassName: "",
    }),
}));
