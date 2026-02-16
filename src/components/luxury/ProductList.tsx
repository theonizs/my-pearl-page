"use client";

import { motion } from "framer-motion";
import { mockProducts, Product } from "@/data/products";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const EASE = [0.16, 1, 0.3, 1] as const;

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

const gridStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ProductListProps {
  products?: Product[];
  hideFilters?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ProductList({
  products = mockProducts,
  hideFilters = false,
}: ProductListProps) {
  // Use passed products or default to all mockProducts
  const displayProducts = products;

  return (
    <section
      id="products"
      className="relative scroll-mt-24 py-28 lg:py-36"
      style={{ backgroundColor: "var(--color-pearl-warm)" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-16 text-center relative"
        >
          <div className="flex items-center justify-center relative">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              THE MASTERPIECES
            </p>
            <Link 
              href="/products-list" 
              className="absolute right-0 top-0 hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal/40 transition-colors hover:text-gold"
            >
              View More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
            Nature’s Finest Treasures
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-charcoal/50">
            Where organic beauty meets master craftsmanship. Each piece tells a story of the deep sea, meticulously set in gold to last a lifetime.
          </p>
        </motion.div>

        {/* Product grid */}
        <motion.div
          variants={gridStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
