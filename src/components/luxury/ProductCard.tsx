"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/data/products";
import { getProductBySlug } from "@/app/actions/products";
import { shimmer, toBase64 } from "@/lib/shimmer";

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------
const EASE = [0.16, 1, 0.3, 1] as const;

const cardFade = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

// ---------------------------------------------------------------------------
// Currency formatter
// ---------------------------------------------------------------------------
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const queryClient = useQueryClient();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["product", product.slug],
      queryFn: () => getProductBySlug(product.slug),
    });
  };

  return (
    <motion.div variants={cardFade} className="h-full">
      <Link
        href={`/products/${product.slug}`}
        onMouseEnter={handlePrefetch}
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gold/10 bg-[#FFFDF8] transition-all hover:shadow-md"
      >
        {/* ── Image ──────────────────────────────────────────────────── */}
        <div className="relative aspect-[3/4] flex-shrink-0 overflow-hidden bg-pearl-warm">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-105 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Hover overlay with Add to Cart */}
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-charcoal/50 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                });
              }}
              className="flex translate-y-3 items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg transition-all duration-500 hover:bg-gold-dark group-hover:translate-y-0"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </motion.button>
          </div>
        </div>

        {/* ── Details ─────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col space-y-3 px-4 py-5">
          {/* Grade badge */}
          <div>
            <span className="inline-block rounded-sm bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              {product.metadata.grade}
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-charcoal transition-colors group-hover:text-gold">
              {product.name}
            </h3>

            <p className="line-clamp-2 text-sm leading-relaxed text-charcoal/60">
              {product.description}
            </p>
          </div>

          <p className="text-sm font-medium text-gold">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
