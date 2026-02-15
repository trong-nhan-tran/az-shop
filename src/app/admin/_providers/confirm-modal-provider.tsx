"use client";
import { useConfirmModal } from "@/app/admin/_hooks/use-confirm-modal";
import ConfirmModal from "@/app/admin/_components/features/confirm-modal";

export default function ConfirmModalProvider() {
  const {
    isOpen,
    title,
    description,
    onConfirm,
    confirmButtonClassName,
    closeModal,
  } = useConfirmModal();

  return (
    <ConfirmModal
      isOpen={isOpen}
      onOpenChange={closeModal}
      title={title}
      description={description}
      onConfirm={() => {
        onConfirm();
        closeModal();
      }}
      confirmButtonClassName={confirmButtonClassName}
    />
  );
}
