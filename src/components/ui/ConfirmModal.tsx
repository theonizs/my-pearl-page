"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface ConfirmModalProps {
  isOpen: boolean;
  modalTitle: string;
  modalDescription: string;
  modalCancelTitle?: string;
  modalConfirmTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const EASE = [0.16, 1, 0.3, 1] as const;

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.05 } },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.2 },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ConfirmModal({
  isOpen,
  modalTitle,
  modalDescription,
  modalCancelTitle = "Cancel",
  modalConfirmTitle = "Confirm",
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onCancel}
            className="fixed inset-0 z-[80] bg-charcoal/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[90] flex items-center justify-center px-4"
          >
            <div className="w-full max-w-sm rounded-xl border border-gold/10 bg-[#FFFDF8] px-6 py-7 shadow-xl">
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <AlertTriangle className="h-6 w-6 text-gold" />
              </div>

              {/* Content */}
              <h3 className="text-center font-[family-name:var(--font-display)] text-lg font-bold text-charcoal">
                {modalTitle}
              </h3>
              <p className="mt-2 text-center text-sm leading-relaxed text-charcoal/60">
                {modalDescription}
              </p>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 rounded-full border border-charcoal/15 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal transition-colors hover:border-gold hover:text-gold"
                >
                  {modalCancelTitle}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  className="flex-1 rounded-full bg-gold py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_4px_16px_rgba(212,175,55,0.25)] transition-colors hover:bg-gold-dark"
                >
                  {modalConfirmTitle}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
