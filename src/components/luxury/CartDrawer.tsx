"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useCartStore, type CartItem } from "@/store/useCartStore";
import ConfirmModal from "@/components/ui/ConfirmModal";

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------
const EASE = [0.16, 1, 0.3, 1] as const;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25, delay: 0.1 } },
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.5, ease: EASE },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.4, ease: [0.4, 0, 0.6, 1] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.25 } },
};

// ---------------------------------------------------------------------------
// Currency formatter
// ---------------------------------------------------------------------------
const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);

// ---------------------------------------------------------------------------
// Cart Item Row
// ---------------------------------------------------------------------------
interface CartItemRowProps {
  item: CartItem;
  onRequestRemove: (item: CartItem) => void;
}

function CartItemRow({ item, onRequestRemove }: CartItemRowProps) {
  const { updateQuantity } = useCartStore();

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      // Would drop to 0 → ask for confirmation instead
      onRequestRemove(item);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group flex gap-4 py-4"
    >
      {/* Thumbnail */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-pearl-deep">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-charcoal/30">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-charcoal">
            {item.name}
          </p>
          {item.metadata?.pearlType && (
            <p className="mt-0.5 text-xs tracking-wide text-charcoal/50">
              {item.metadata.pearlType}
              {item.metadata.length ? ` · ${item.metadata.length}` : ""}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              aria-label="Decrease quantity"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-charcoal/10 text-charcoal/60 transition-all hover:border-gold hover:text-gold hover:scale-110"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm font-medium text-charcoal">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-charcoal/10 text-charcoal/60 transition-all hover:border-gold hover:text-gold hover:scale-110"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price + Remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-charcoal">
              {formatPrice(item.price * item.quantity)}
            </span>
            <button
              onClick={() => onRequestRemove(item)}
              aria-label="Remove item"
              className="text-charcoal/30 transition-all hover:text-red-500 hover:scale-110"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main CartDrawer
// ---------------------------------------------------------------------------
interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice } = useCart();
  const { removeItem } = useCartStore();

  // ── Confirm-remove state ────────────────────────────────────────
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const handleRequestRemove = useCallback((item: CartItem) => {
    setItemToRemove(item);
    setConfirmOpen(true);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    if (itemToRemove) {
      removeItem(itemToRemove.id);
    }
    setConfirmOpen(false);
    setItemToRemove(null);
  }, [itemToRemove, removeItem]);

  const handleCancelRemove = useCallback(() => {
    setConfirmOpen(false);
    setItemToRemove(null);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key (only if confirm modal is NOT open)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !confirmOpen) onClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, confirmOpen]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* ── Backdrop ─────────────────────────────────────────────── */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onClose}
              className="fixed inset-0 z-[60] bg-charcoal/40 backdrop-blur-sm"
            />

            {/* ── Drawer Panel ─────────────────────────────────────────── */}
            <motion.aside
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 z-[70] flex h-full w-full flex-col border-l border-charcoal/5 bg-pearl shadow-2xl sm:max-w-md"
            >
              {/* ── Header ───────────────────────────────────────────── */}
              <div className="flex items-center justify-between border-b border-charcoal/5 px-6 py-5">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wide text-charcoal">
                    Your Collection
                  </h2>
                  <p className="mt-0.5 text-xs tracking-wide text-charcoal/50">
                    {totalItems > 0
                      ? `${totalItems} item${totalItems > 1 ? "s" : ""} in your bag`
                      : "Browse our exquisite pieces"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close cart"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/10 text-charcoal/60 transition-all hover:border-gold hover:text-gold"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ── Items ────────────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto px-6">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 py-20">
                    <ShoppingBag
                      className="h-16 w-16 text-charcoal/10"
                      strokeWidth={1}
                    />
                    <p className="font-[family-name:var(--font-display)] text-lg font-medium text-charcoal/40">
                      Your collection is empty
                    </p>
                    <p className="text-center text-sm text-charcoal/30">
                      Discover timeless pieces worth cherishing.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onClose}
                      className="mt-4 rounded-full border border-charcoal/15 px-8 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-charcoal transition-colors hover:border-gold hover:text-gold"
                    >
                      Continue Browsing
                    </motion.button>
                  </div>
                ) : (
                  <div className="divide-y divide-charcoal/5">
                    <AnimatePresence mode="popLayout">
                      {items.map((item) => (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          onRequestRemove={handleRequestRemove}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* ── Footer: Subtotal + Checkout ──────────────────────── */}
              {items.length > 0 && (
                <div className="border-t border-charcoal/5 px-6 pb-6 pt-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-charcoal/60">
                      Subtotal
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-lg font-bold text-charcoal">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <Link href="/checkout" onClick={onClose}>
                    <motion.button
                      id="checkout-button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-full bg-gold py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-all duration-500 hover:bg-gold-dark hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)]"
                    >
                      Proceed to Checkout
                    </motion.button>
                  </Link>
                  <p className="mt-3 text-center text-[11px] text-charcoal/40">
                    Shipping &amp; taxes calculated at checkout
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Confirm Remove Modal ──────────────────────────────────── */}
      <ConfirmModal
        isOpen={confirmOpen}
        modalTitle="Remove Item"
        modalDescription={
          itemToRemove
            ? `Do you want to remove ${itemToRemove.name} from your cart?`
            : ""
        }
        modalCancelTitle="Keep It"
        modalConfirmTitle="Remove"
        onCancel={handleCancelRemove}
        onConfirm={handleConfirmRemove}
      />
    </>
  );
}
