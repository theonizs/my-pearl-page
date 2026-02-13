"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/useCartStore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

// ---------------------------------------------------------------------------
// Mockup Data
// ---------------------------------------------------------------------------
const PRODUCTS: Product[] = [
  {
    id: "south-sea-strand",
    name: "South Sea Strand",
    price: 4800,
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=85&auto=format",
    category: "Necklace",
  },
  {
    id: "akoya-classic",
    name: "Akoya Classic Choker",
    price: 2400,
    imageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85&auto=format",
    category: "Necklace",
  },
  {
    id: "golden-drop-earrings",
    name: "Golden Drop Earrings",
    price: 1200,
    imageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=85&auto=format",
    category: "Earrings",
  },
  {
    id: "baroque-statement",
    name: "Baroque Statement Ring",
    price: 1850,
    imageUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85&auto=format",
    category: "Ring",
  },
];

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
// Product Card
// ---------------------------------------------------------------------------
function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div variants={cardFade}>
      <Card className="group relative overflow-hidden border-0 bg-transparent shadow-none">
        {/* Image container */}
        <div className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-pearl-deep">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative h-full w-full"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </motion.div>

          {/* Hover overlay with Add to Cart */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 flex items-end justify-center rounded-2xl bg-gradient-to-t from-charcoal/40 via-transparent to-transparent p-6"
          >
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.imageUrl,
                })
              }
              className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg transition-colors duration-300 hover:bg-gold-dark"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </motion.button>
          </motion.div>
        </div>

        {/* Details */}
        <CardContent className="px-1 pt-5 pb-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal/40">
            {product.category}
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-charcoal">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-gold">
            ${product.price.toLocaleString()}
          </p>
        </CardContent>
      </Card>
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
            Each piece is a testament to nature&apos;s artistry, perfected by
            generations of master craftsmen.
          </p>
        </motion.div>

        {/* Product grid */}
        <motion.div
          variants={gridStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
