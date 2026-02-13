"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useCartStore, type CartItem } from "@/store/useCartStore";
import { smoothScrollTo } from "@/lib/scrollUtils";

// ---------------------------------------------------------------------------
// Nav links
// ---------------------------------------------------------------------------
const NAV_LINKS = [
  { label: "Collections", sectionId: "collection" },
  { label: "Our Story", sectionId: "about" },
] as const;

// ---------------------------------------------------------------------------
// Cart Item Row
// ---------------------------------------------------------------------------
function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group flex gap-4 py-4"
    >
      {/* Thumbnail */}
      <div className="h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-pearl-deep">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
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

          {/* Price + remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-charcoal">
              ${(item.price * item.quantity).toLocaleString()}
            </span>
            <button
              onClick={() => removeItem(item.id)}
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
// Main Navbar Component
// ---------------------------------------------------------------------------
export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, totalItems, totalPrice } = useCart();



  const scrollToSection = useCallback((e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === "undefined") return;

    const target = document.getElementById(sectionId);
    if (!target) return;

    const navHeight = 80;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

    smoothScrollTo(targetPosition, 1000);
    setMobileOpen(false);
  }, [setMobileOpen]);

  return (
    <>
      {/* ── Navigation Bar ─────────────────────────────────────────── */}
      <nav
        id="navbar"
        className="fixed top-0 left-0 z-50 w-full border-b border-white/10"
        style={{
          background: "rgba(253,252,251,0.6)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* ── Logo ───────────────────────────────────────────────── */}
          <a
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-[0.25em] text-charcoal"
          >
            PEARL
          </a>

          {/* ── Desktop links ──────────────────────────────────────── */}
          <ul className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map(({ label, sectionId }) => (
              <li key={label}>
                <button
                  onClick={(e) => scrollToSection(e, sectionId)}
                  className="text-sm font-medium tracking-wide text-charcoal/70 transition-colors duration-300 hover:text-gold"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* ── Right side: Cart + Mobile toggle ────────────────────── */}
          <div className="flex items-center gap-5">
            {/* Cart trigger */}
            <button
              id="cart-button"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative text-charcoal transition-colors duration-300 hover:text-gold"
            >
              <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-button"
              aria-label="Toggle menu"
              className="md:hidden text-charcoal transition-colors hover:text-gold"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ──────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-white/10 md:hidden"
              style={{
                background: "rgba(253,252,251,0.9)",
                backdropFilter: "blur(20px)",
              }}
            >
              <ul className="flex flex-col gap-4 px-6 py-6">
                {NAV_LINKS.map(({ label, sectionId }) => (
                  <li key={label}>
                    <button
                      onClick={(e) => scrollToSection(e, sectionId)}
                      className="block text-base font-medium tracking-wide text-charcoal/70 transition-colors hover:text-gold"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Cart Drawer (Shadcn Sheet) ─────────────────────────────── */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col border-l border-charcoal/5 bg-pearl sm:max-w-md"
        >
          <SheetHeader className="px-6 pt-6">
            <SheetTitle className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wide text-charcoal">
              Your Collection
            </SheetTitle>
            <SheetDescription className="text-xs tracking-wide text-charcoal/50">
              {totalItems > 0
                ? `${totalItems} item${totalItems > 1 ? "s" : ""} in your bag`
                : "Browse our exquisite pieces"}
            </SheetDescription>
          </SheetHeader>

          <Separator className="bg-charcoal/5" />

          {/* ── Cart items list ─────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6">
            {items.length === 0 ? (
              /* Empty state */
              <div className="flex h-full flex-col items-center justify-center gap-4 py-20">
                <ShoppingBag className="h-16 w-16 text-charcoal/10" strokeWidth={1} />
                <p className="font-[family-name:var(--font-display)] text-lg font-medium text-charcoal/40">
                  Your collection is empty
                </p>
                <p className="text-center text-sm text-charcoal/30">
                  Discover timeless pieces worth cherishing.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setCartOpen(false)}
                  className="mt-4 rounded-full border-charcoal/15 px-8 text-xs font-medium uppercase tracking-[0.15em] text-charcoal transition-colors hover:border-gold hover:text-gold"
                >
                  Continue Browsing
                </Button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* ── Footer: Totals + Checkout ───────────────────────────── */}
          {items.length > 0 && (
            <SheetFooter className="border-t border-charcoal/5 px-6 pb-6 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal/60">
                  Subtotal
                </span>
                <span className="font-[family-name:var(--font-display)] text-lg font-bold text-charcoal">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  id="checkout-button"
                  className="w-full rounded-full bg-gold py-6 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-all duration-500 hover:bg-gold-dark hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)]"
                >
                  Proceed to Checkout
                </Button>
              </motion.div>
              <p className="mt-2 text-center text-[11px] text-charcoal/40">
                Shipping & taxes calculated at checkout
              </p>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
