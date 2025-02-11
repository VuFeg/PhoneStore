"use client";

import { useCallback, memo, useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

const ConfirmDeleteModal = memo<ConfirmDeleteModalProps>(
  ({ isOpen, onClose, onConfirm, itemName = "this item" }) => {
    const handleOverlayClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      [onClose]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      },
      [onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="w-full max-w-[400px] transform rounded-lg bg-card p-6 shadow-lg transition-all"
          role="alertdialog"
        >
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3">
              <FiAlertTriangle
                className="h-6 w-6 text-destructive"
                aria-hidden="true"
              />
            </div>
            <h2
              id="modal-title"
              className="mb-2 text-xl font-heading text-foreground"
            >
              Confirm Deletion
            </h2>
            <p className="text-center text-body text-accent">
              Are you sure you want to delete {itemName}? This action cannot be
              undone.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={onClose}
              className="rounded-md border border-input bg-card px-4 py-2 text-sm font-body text-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Cancel deletion"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md bg-destructive px-4 py-2 text-sm font-body text-destructive-foreground transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Confirm deletion"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ConfirmDeleteModal.displayName = "ConfirmDeleteModal";

export default ConfirmDeleteModal;
