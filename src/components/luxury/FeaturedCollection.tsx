"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories, Category } from "@/data/categories";

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const EASE = [0.16, 1, 0.3, 1] as const;

const sectionFade = {
  hidden: { opacity: 0, y: 40 },
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

const cardFade = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

// ---------------------------------------------------------------------------
// Category Card
// ---------------------------------------------------------------------------
function CategoryCard({ category }: { category: Category }) {
  return (
    <motion.div
      variants={cardFade}
      whileHover="hover"
      className="group relative h-full w-full cursor-pointer"
    >
      <Link href={`/products-list?category=${category.title}`}>
        {/* ── Image Container ──────────────────────────────────────── */}
        <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-2xl bg-pearl-deep">
          {/* Image with hover scale (desktop only via motion) */}
          <motion.div
            className="relative h-full w-full"
            variants={{
              hover: { scale: 1.05 },
            }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </motion.div>

          {/* Desktop-only Overlay Gradient + Content */}
          <div className="absolute inset-0 hidden lg:flex flex-col justify-end rounded-2xl bg-gradient-to-t from-charcoal/70 via-charcoal/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <motion.div
              className="p-8"
              variants={{
                hover: { y: -8 },
              }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <h3 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-wide text-white">
                {category.title}
              </h3>
              <p className="mb-5 max-w-[90%] text-sm leading-relaxed text-white/80">
                {category.description}
              </p>
              <motion.div
                variants={{
                  hover: { x: 5, opacity: 1 },
                }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold"
              >
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop-only: always-visible title at bottom */}
          <div className="absolute bottom-0 inset-x-0 hidden lg:block bg-gradient-to-t from-charcoal/60 to-transparent p-6 group-hover:opacity-0 transition-opacity duration-300">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
              {category.title}
            </h3>
          </div>
        </div>

        {/* ── Mobile / Tablet Content (below image) ────────────────── */}
        <div className="mt-5 space-y-2 lg:hidden">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wide text-charcoal">
            {category.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-charcoal/60">
            {category.description}
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs font-bold uppercase tracking-widest text-gold transition-colors group-hover:text-gold/80">
            <span>Explore Collection</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
export default function FeaturedCollection() {
  return (
    <section
      id="collection"
      className="relative scroll-mt-24 py-28 lg:py-36"
      style={{ backgroundColor: "var(--color-pearl-warm)" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
            Our Collection
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
            Curated Elegance
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-charcoal/50">
            Discover our exclusive categories, each piece a testament to nature&apos;s artistry and timeless design.
          </p>
        </motion.div>

        {/* Categories grid */}
        <motion.div
          variants={gridStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
