"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { smoothScrollTo } from "@/lib/scrollUtils";

// ---------------------------------------------------------------------------
// Animation config
// ---------------------------------------------------------------------------
const EASE = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);


  const scrollToSection = useCallback((e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Strict: Stop immediate propagation to prevent other listeners
    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();

    if (typeof window === "undefined") return;

    const target = document.getElementById(sectionId);
    if (!target) return;

    const navHeight = 80;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

    smoothScrollTo(targetPosition);
  }, []);

  // Parallax scroll for the product image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(165deg, var(--color-pearl) 0%, var(--color-pearl-warm) 35%, var(--color-pearl-deep) 100%)",
      }}
    >
      {/* ── Decorative gold orbs ──────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full opacity-[0.12]"
        style={{
          background:
            "radial-gradient(circle, var(--color-gold-light) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -left-52 h-[700px] w-[700px] rounded-full opacity-[0.10]"
        style={{
          background:
            "radial-gradient(circle, var(--color-gold) 0%, transparent 65%)",
        }}
      />

      {/* ── Main grid ────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-28 pb-20 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:pt-0 lg:pb-0">
        {/* ── Left: Text content ───────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeSlideUp}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold"
          >
            Hand-Selected · Heirloom Quality
          </motion.p>

          {/* Main heading */}
          <motion.h1
            variants={fadeSlideUp}
            className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.1] tracking-tight text-charcoal sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Timeless
            <br />
            <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
              Lustre
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeSlideUp}
            className="mt-7 max-w-md text-base leading-relaxed text-charcoal/55 lg:text-lg"
          >
            Discover our curated collection of South Sea pearls —
            each hand-selected for its radiance, shape, and timeless elegance
            that transcends generations.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeSlideUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <button
              onClick={(e) => scrollToSection(e,"collection")}
              
              id="cta-explore"
              className="inline-flex h-14 items-center justify-center rounded-full bg-charcoal px-10 text-[13px] font-semibold uppercase tracking-[0.2em] text-pearl transition-all duration-500 hover:bg-gold hover:shadow-[0_8px_30px_rgba(212,175,55,0.35)]"
            >
              Explore Collection
            </button>
            <button
              onClick={(e) => scrollToSection(e, "about")}
              id="cta-story"
              className="inline-flex h-14 items-center justify-center rounded-full border border-charcoal/15 px-10 text-[13px] font-semibold uppercase tracking-[0.2em] text-charcoal transition-all duration-500 hover:border-gold hover:text-gold"
            >
              Our Story
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeSlideUp}
            className="mt-12 flex items-center gap-8 opacity-40"
          >
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-xl font-bold text-charcoal">
                25+
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/70">
                Years
              </p>
            </div>
            <div className="h-8 w-px bg-charcoal/15" />
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-xl font-bold text-charcoal">
                12K+
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/70">
                Clients
              </p>
            </div>
            <div className="h-8 w-px bg-charcoal/15" />
            <div className="text-center">
              <p className="font-[family-name:var(--font-display)] text-xl font-bold text-charcoal">
                AAA
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/70">
                Grade
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: Product image with parallax ────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
          className="relative flex items-center justify-center"
        >
          {/* Glow ring behind the image */}
          <div
            aria-hidden
            className="absolute inset-0 m-auto h-[85%] w-[85%] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, var(--color-gold-light) 0%, transparent 60%)",
              filter: "blur(40px)",
            }}
          />

          {/* Product image container */}
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="gpu-accelerated relative aspect-[4/5] w-full max-w-lg overflow-hidden rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.08)]"
          >
            <Image
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=90&auto=format"
              alt="Lustrous South Sea pearl necklace displayed on silk fabric"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Subtle gradient overlay at bottom for depth */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-pearl/20 via-transparent to-transparent"
            />
          </motion.div>

          {/* Floating label */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
            className="absolute -right-2 bottom-16 rounded-2xl border border-white/40 bg-white/70 px-5 py-3 shadow-lg backdrop-blur-md lg:-right-6"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
              Featured
            </p>
            <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-charcoal">
              South Sea Strand
            </p>
            <p className="text-xs text-gold">$4,800</p>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
            Scroll
          </span>
          <div className="h-8 w-px bg-charcoal/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
