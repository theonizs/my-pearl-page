"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Settings2,
  Loader2,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { type Product } from "@/data/products";
import { getProductsAction } from "@/app/actions/products";
import ProductCard from "@/components/luxury/ProductCard";
import Navbar from "@/components/luxury/Navbar";

// ---------------------------------------------------------------------------
// Constants & Types
// ---------------------------------------------------------------------------
const ALL_CATEGORIES = ["Necklaces", "Earrings", "Rings", "Bracelets"];
const INITIAL_COLORS: string[] = [];

type SortOption = "price-asc" | "price-desc";

interface FilterState {
  search: string;
  maxPrice: number;
  collections: string[];
  colors: string[];
  sortBy: SortOption;
}

// ---------------------------------------------------------------------------
// Sub-Components
// ---------------------------------------------------------------------------

interface FilterControlsProps {
  filters: FilterState;
  setFilters: (f: FilterState | ((prev: FilterState) => FilterState)) => void;
  toggleCollection: (cat: string) => void;
  toggleColor: (col: string) => void;
  totalResults: number;
}

function FilterControls({
  filters,
  setFilters,
  toggleCollection,
  toggleColor,
  totalResults,
}: FilterControlsProps) {
  return (
    <div className="space-y-8">
      {/* Sorting */}
      <div className="relative">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal/50">
          <ArrowUpDown className="h-3 w-3" /> Sort By
        </div>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sortBy: e.target.value as SortOption,
            }))
          }
          className="w-full appearance-none rounded-lg border border-charcoal/10 bg-white/50 px-4 py-2.5 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Price Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-charcoal">
          <span className="font-semibold">Max Price</span>
          <span className="font-mono text-charcoal/60">
            ${filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100000"
          step="1000"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              maxPrice: Number(e.target.value),
            }))
          }
          className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-charcoal/10 accent-gold"
        />
      </div>

      {/* Collections Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/50">
          Collections
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCollection(cat)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                filters.collections.includes(cat)
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-charcoal/20 text-charcoal/60 hover:border-gold hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Colors Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/50">
          Pearl Color
        </h3>
        <div className="flex flex-wrap gap-2">
          {["White", "Cream", "Gold", "Black", "Multicolor"].map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                filters.colors.includes(color)
                  ? "border-gold bg-gold text-white shadow-md"
                  : "border-charcoal/20 text-charcoal/60 hover:border-gold hover:text-gold"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Summary */}
      <div className="rounded-lg bg-white/40 p-4 text-xs text-charcoal/60">
        <p>Showing loaded results</p>
        {(filters.search ||
          filters.colors.length > 0 ||
          filters.maxPrice < 100000 ||
          filters.collections.length < 4) && (
          <button
            onClick={() =>
              setFilters({
                search: "",
                maxPrice: 100000,
                collections: ALL_CATEGORIES,
                colors: [],
                sortBy: "price-asc",
              })
            }
            className="mt-2 flex items-center gap-1 text-red-500 hover:underline"
          >
            <X className="h-3 w-3" /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── State ─────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    maxPrice: 100000,
    collections: initialCategory ? [initialCategory] : ALL_CATEGORIES,
    colors: INITIAL_COLORS,
    sortBy: "price-asc",
  });

  // Keep a ref to always have the latest filters without recreating callbacks
  const filtersRef = useRef(filters);
  useEffect(() => { filtersRef.current = filters; }, [filters]);

  const nextCursorRef = useRef(nextCursor);
  useEffect(() => { nextCursorRef.current = nextCursor; }, [nextCursor]);

  const { ref, inView } = useInView();

  // ── Handlers ──────────────────────────────────────────────────────────
  const toggleCollection = (category: string) => {
    setFilters((prev) => {
      const exists = prev.collections.includes(category);
      return {
        ...prev,
        collections: exists
          ? prev.collections.filter((c) => c !== category)
          : [...prev.collections, category],
      };
    });
  };

  const toggleColor = (color: string) => {
    setFilters((prev) => {
      const exists = prev.colors.includes(color);
      return {
        ...prev,
        colors: exists
          ? prev.colors.filter((c) => c !== color)
          : [...prev.colors, color],
      };
    });
  };

  // ── Stable fetch (reads latest filters from ref) ──────────────────────
  const fetchProducts = useCallback(async (cursor: number, isReset: boolean) => {
    if (isLoadingRef.current) return; // Prevent overlapping calls
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const f = filtersRef.current;
      const { products: newProducts, nextCursor: newCursor } = await getProductsAction(
        cursor,
        8,
        {
          search: f.search,
          maxPrice: f.maxPrice,
          collections: f.collections,
          colors: f.colors,
          sortBy: f.sortBy,
        }
      );

      if (isReset) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }
      setNextCursor(newCursor);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []); // ← No filter dependencies! Reads from ref.

  // ── Debounced reset fetch (fires 500ms after last filter change) ──────
  const debouncedResetFetch = useDebouncedCallback(() => {
    setProducts([]);
    setNextCursor(1);
    fetchProducts(1, true);
  }, 500);

  // ── Effects ───────────────────────────────────────────────────────────

  // 1. Trigger debounced fetch whenever filters change
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      // Fetch immediately on first mount (no debounce)
      isFirstMount.current = false;
      fetchProducts(1, true);
      return;
    }
    debouncedResetFetch();
  }, [
    filters.search,
    filters.maxPrice,
    filters.collections,
    filters.colors,
    filters.sortBy,
    debouncedResetFetch,
    fetchProducts,
  ]);

  // 2. Infinite Scroll (fires immediately, not debounced)
  useEffect(() => {
    if (inView && !isLoadingRef.current && nextCursorRef.current && products.length > 0) {
      fetchProducts(nextCursorRef.current, false);
    }
  }, [inView, products.length, fetchProducts]);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-pearl-warm selection:bg-gold/20">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[family-name:var(--font-display)] text-4xl font-bold text-charcoal sm:text-5xl"
          >
            Curated Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-charcoal/60"
          >
            Discover the finest pearls from around the world.
          </motion.p>
        </div>

        {/* ── Filters & Controls ────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
          
          {/* Mobile Header: Search + Filter Toggle */}
          <div className="flex w-full items-center gap-3 lg:hidden">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full rounded-full border border-charcoal/10 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-gold hover:text-gold"
            >
              <Settings2 className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden w-64 flex-shrink-0 space-y-8 lg:block">
            {/* Search (Desktop only) */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search masterpieces..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full rounded-full border border-charcoal/10 bg-white/50 py-3 pl-12 pr-4 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
            </div>
            
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              toggleCollection={toggleCollection}
              toggleColor={toggleColor}
              totalResults={products.length}
            />
          </aside>

          {/* ── Product Grid ──────────────────────────────────────────── */}
          <div className="flex-1">
            <motion.div
              layout
              className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {products.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal/10 bg-white/30 text-center"
              >
                <SlidersHorizontal className="mb-4 h-8 w-8 text-charcoal/20" />
                <p className="font-[family-name:var(--font-display)] text-lg font-medium text-charcoal/60">
                  No masterpieces found
                </p>
                <p className="text-sm text-charcoal/40">
                  Try adjusting your filters to reveal more treasures.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      search: "",
                      maxPrice: 100000,
                      collections: ALL_CATEGORIES,
                      colors: [],
                      sortBy: "price-asc",
                    })
                  }
                  className="mt-4 text-sm font-semibold text-gold hover:underline"
                >
                  Reset all filters
                </button>
              </motion.div>
            )}

            {/* Loading Spinner & Intersection Trigger */}
            <div
              ref={ref}
              className="mt-12 flex h-24 items-center justify-center"
            >
              {isLoading && (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-gold" />
                  <span className="text-xs tracking-wider text-gold/80">LOADING MASTERPIECES</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-[80] bg-charcoal/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-xs flex-col bg-pearl shadow-2xl lg:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-charcoal/5 px-6 py-5">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-charcoal">
                  Filters
                </h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-full p-2 text-charcoal/60 hover:bg-charcoal/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <FilterControls
                  filters={filters}
                  setFilters={setFilters}
                  toggleCollection={toggleCollection}
                  toggleColor={toggleColor}
                  totalResults={products.length}
                />
              </div>

              {/* Footer Actions */}
              <div className="border-t border-charcoal/5 bg-white px-6 py-5">
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setFilters({
                        search: "",
                        maxPrice: 100000,
                        collections: ALL_CATEGORIES,
                        colors: [],
                        sortBy: "price-asc",
                      })
                    }
                    className="flex-1 rounded-full border border-charcoal/10 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-white"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 rounded-full bg-gold py-3 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95"
                  >
                    Show ({products.length})
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
