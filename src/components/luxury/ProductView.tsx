"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Product, mockProducts } from "@/data/products";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Navbar from "./Navbar";
import { shimmer, toBase64 } from "@/lib/shimmer";
import { PEARL_COLORS } from "@/constants/product";

export default function ProductView({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
 const { addItem, setIsOpen } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      metadata: product.metadata,
    }, quantity);
    setIsOpen(true);
  };

  const increment = () => setQuantity((q) => (q < product.stock ? q + 1 : q));
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Related Products: same category first, fill to 4 with random others
  const relatedProducts = useMemo(() => {
    const sameCategory = mockProducts.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    const others = mockProducts.filter(
      (p) => p.category !== product.category && p.id !== product.id
    );
    const sorted = [...sameCategory, ...others.sort(() => Math.random() - 0.5)];
    return sorted.slice(0, 4);
  }, [product.id, product.category]);

  // Helper: Badge สไตล์หรูหราสำหรับ Details ทุกจุด
  const DetailBadge = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/50">
        {label}
      </span>
      <div className="inline-flex items-center rounded-md bg-stone-50/50 pl-0 pr-4 py-2 backdrop-blur-sm">
        <span className="text-sm font-medium text-charcoal">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-pearl-warm">
      <Navbar />
      
      <main className="mx-auto max-w-7xl pt-28 pb-20 px-6 lg:px-12">
        <div className="mb-10">
          <Link href="/products-list" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal/40 hover:text-gold transition-colors">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
          {/* Gallery Section */}
          <div className="space-y-6">
            <motion.div layoutId={`product-image-${product.id}`} className="relative w-full aspect-square md:aspect-auto md:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl bg-[#FFFDF8] shadow-sm border border-gold/5">
               <AnimatePresence mode="wait">
                <motion.div key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative h-full w-full">
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1000, 1000))}`}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(img)} className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${selectedImage === img ? "border-gold ring-4 ring-gold/5" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <Image
                    src={img}
                    alt="thumb"
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(80, 80))}`}
                    sizes="(max-width: 768px) 20vw, 100px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-gold/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gold border border-gold/20">
                  {product.category}
                </span>
                <span className="rounded-full bg-charcoal px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                  Grade {product.metadata.grade}
                </span>
              </div>

              <h1 className="mb-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-charcoal tracking-tight lg:text-6xl">
                {product.name}
              </h1>
              <div className="mb-8 text-3xl font-light text-gold italic">
                ${product.price.toLocaleString()}
              </div>

              <p className="mb-10 text-base leading-relaxed text-charcoal/60 max-w-lg border-l-2 border-gold/20 pl-6 italic">
                {product.description}
              </p>

              {/* Colors - Badge Row */}
              <div className="mb-10">
  <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/50">
    Available Colors
  </span>
  <div className="flex flex-wrap gap-3">
    {product.colors?.map((color) => {
      // ดึงสีจาก Mapping ถ้าไม่มีให้ใช้สี default
      const colorKey = color.toLowerCase();
      const dotColor = PEARL_COLORS[colorKey] || PEARL_COLORS.default;

      return (
        <span 
          key={color} 
          className="inline-flex items-center rounded-full border border-gold/20 bg-gold/5 px-3 py-2 text-xs font-semibold text-charcoal shadow-sm transition-all hover:bg-gold/10"
        >
          {/* แสดงจุดสีตามค่าที่ Map ไว้ */}
          <span className={`mr-2 h-3 w-3 rounded-full shadow-inner ${dotColor}`} />
          {color}
        </span>
      );
    })}
  </div>
</div>

              {/* Details Grid - Every detail as a Badge */}
              <div className="mb-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 border-t border-charcoal/5 pt-10">
                <DetailBadge label="Pearl Type" value={product.metadata.pearlType} />
                <DetailBadge label="Length" value={product.metadata.length || "N/A"} />
                <DetailBadge label="Luster" value="Excellent" />
                <DetailBadge label="Surface" value="Clean (95%+)" />
              </div>

              {/* Actions - THE PIXEL-PERFECT GRID FIX */}
<div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:h-16">
  
  {/* Quantity Selector: ใช้ sm:col-span-4 เพื่อล็อกพื้นที่ฝั่งซ้าย */}
  <div className="flex h-16 items-center justify-between rounded-full border border-charcoal/10 bg-white px-4 shadow-sm sm:col-span-4 sm:h-full">
    <button 
      onClick={decrement} 
      className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-pearl-warm hover:text-gold active:scale-90" 
      disabled={quantity <= 1}
    >
      <Minus className="h-4 w-4" />
    </button>
    
    <span className="text-xl font-bold text-charcoal tabular-nums">
      {quantity}
    </span>
    
    <button 
      onClick={increment} 
      className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-pearl-warm hover:text-gold active:scale-90" 
      disabled={quantity >= product.stock}
    >
      <Plus className="h-4 w-4" />
    </button>
  </div>

  {/* Add to Cart Button: ใช้ sm:col-span-8 ให้ขยายตามพื้นที่ที่เหลือ */}
  <button 
    onClick={handleAddToCart} 
    className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#2D2D2D] p-0 text-white shadow-2xl shadow-charcoal/10 transition-all hover:bg-gold active:scale-[0.98] sm:col-span-8 sm:h-full"
  >
    <ShoppingBag className="relative z-10 h-5 w-5 transition-transform group-hover:scale-110" />
    <span className="relative z-10 text-sm font-black uppercase tracking-[0.25em]">
      Add to Cart
    </span>
    {/* Background Slide Effect */}
    <div className="absolute inset-0 translate-y-full bg-gold transition-transform duration-300 group-hover:translate-y-0" />
  </button>
</div>

              {/* Trust Signals */}
              <div className="flex flex-wrap gap-8 border-t border-charcoal/5 pt-10">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">
                  <ShieldCheck className="h-5 w-5 text-gold/60" />
                  <span>Certificate of Authenticity</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">
                  <Truck className="h-5 w-5 text-gold/60" />
                  <span>Free Global Shipping</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 border-t border-charcoal/5 pt-16">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                  Complete the Look
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-charcoal lg:text-4xl">
                  You May Also Like
                </h2>
              </div>
              <Link
                href="/products-list"
                className="group hidden text-xs font-bold uppercase tracking-widest text-charcoal/40 transition-colors hover:text-gold sm:inline-flex"
              >
                <span className="border-b border-transparent transition-all group-hover:border-gold">
                  View All Collection
                </span>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            >
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          </section>
        )}
      </main>
    </div>
  );
}