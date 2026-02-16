"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { smoothScrollTo } from "@/lib/scrollUtils";
import CartDrawer from "./CartDrawer";

// ---------------------------------------------------------------------------
// Nav links
// ---------------------------------------------------------------------------
const NAV_LINKS = [
  { label: "Collections", sectionId: "collection" },
  { label: "Our Story", sectionId: "about" },
  { label: "Products", sectionId: "products" },
] as const;

// ---------------------------------------------------------------------------
// Main Navbar Component
// ---------------------------------------------------------------------------
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, isOpen, setIsOpen } = useCart();
  const pathname = usePathname();
  const isHome = pathname === "/";

  /* ── Mounted state for hydration fix ───────────────────────── */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      e.stopPropagation();
      // Strict: Stop immediate propagation to prevent other listeners
      if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();

      if (typeof window === "undefined") return;

      const target = document.getElementById(sectionId);
      if (!target) return;

      const navHeight = 80;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      smoothScrollTo(targetPosition);
      setMobileOpen(false);
    },
    [setMobileOpen],
  );

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
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-[0.25em] text-charcoal"
          >
           NJ PEARL
          </Link>

          {/* ── Desktop links ──────────────────────────────────────── */}
          <ul className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map(({ label, sectionId }) => (
              <li key={label}>
                {isHome ? (
                  <button
                    onClick={(e) => scrollToSection(e, sectionId)}
                    className="text-sm font-medium tracking-wide text-charcoal/70 transition-colors duration-300 hover:text-gold"
                  >
                    {label}
                  </button>
                ) : (
                  <Link
                    href={`/#${sectionId}`}
                    className="text-sm font-medium tracking-wide text-charcoal/70 transition-colors duration-300 hover:text-gold"
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* ── Right side: Cart + Mobile toggle ────────────────────── */}
          <div className="flex items-center gap-5">
            {/* Cart trigger */}
            <button
              id="cart-button"
              aria-label="Open cart"
              onClick={() => setIsOpen(true)}
              className="relative text-charcoal transition-colors duration-300 hover:text-gold"
            >
              <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
              {mounted && totalItems > 0 && (
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
              className="text-charcoal transition-colors hover:text-gold md:hidden"
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
                    {isHome ? (
                      <button
                        onClick={(e) => scrollToSection(e, sectionId)}
                        className="block text-base font-medium tracking-wide text-charcoal/70 transition-colors hover:text-gold"
                      >
                        {label}
                      </button>
                    ) : (
                      <Link
                        href={`/#${sectionId}`}
                        onClick={() => setMobileOpen(false)}
                        className="block text-base font-medium tracking-wide text-charcoal/70 transition-colors hover:text-gold"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Cart Drawer (Framer Motion) ────────────────────────────── */}
      <CartDrawer open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
