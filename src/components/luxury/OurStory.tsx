"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

// ---------------------------------------------------------------------------
// Animation config
// ---------------------------------------------------------------------------
const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: EASE },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function OurStory() {
  const imageRef = useRef<HTMLDivElement>(null);

  // Soft parallax on the image
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      id="about"
      className="relative scroll-mt-24 overflow-hidden py-28 lg:py-36"
      style={{ backgroundColor: "var(--color-pearl)" }}
    >
      {/* Decorative gold accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle, var(--color-gold-light) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
        {/* ── Left: Image with parallax ──────────────────────────── */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          ref={imageRef}
          className="relative"
        >
          {/* Main image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <motion.div
              style={{ y: imageY }}
              className="absolute inset-[-10%] h-[120%] w-[120%]"
            >
              <Image
                src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=85&auto=format"
                alt="Master craftsman carefully selecting and grading lustrous pearls by hand"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Soft gradient overlay */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent"
            />
          </div>

          {/* Floating stat badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            className="absolute -bottom-6 -right-4 rounded-2xl border border-white/50 bg-white/80 px-6 py-4 shadow-lg backdrop-blur-md lg:-right-8"
          >
            <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-gold">
              25+
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
              Years of Mastery
            </p>
          </motion.div>
        </motion.div>

        {/* ── Right: Text content ────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold"
          >
            Hand-Crafted Excellence Since 1998
          </motion.p>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight text-charcoal sm:text-5xl lg:text-6xl"
          >
            The Art of
            <br />
            <span className="text-gold">the Pearl</span>
          </motion.h2>

          {/* Story paragraphs */}
          <motion.p
            variants={fadeUp}
            className="mt-8 text-base leading-[1.85] text-charcoal/55 lg:text-lg"
          >
            Every pearl in our collection begins its journey in the pristine
            waters of the South Pacific. Our master artisans travel to the
            world&apos;s most renowned pearl farms, hand-selecting only the top
            1% of harvested gems — those with the most luminous nacre, flawless
            surfaces, and that unmistakable warm glow that catches the light
            like liquid moonshine.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-5 text-base leading-[1.85] text-charcoal/55 lg:text-lg"
          >
            Back in our atelier, each pearl is meticulously graded, matched for
            colour and lustre, then strung by hand on silk thread with a
            precision knot between every gem — a centuries-old technique that
            ensures both security and an elegant drape. The result is a piece of
            jewellery that is not merely worn, but inherited.
          </motion.p>

          {/* Signature values */}
          <motion.div
            variants={fadeUp}
            className="mt-10 grid grid-cols-3 gap-6 border-t border-charcoal/8 pt-8"
          >
            {[
              { value: "AAA", label: "Grade Only" },
              { value: "100%", label: "Hand-Strung" },
              { value: "Lifetime", label: "Guarantee" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center lg:text-left">
                <p className="font-[family-name:var(--font-display)] text-xl font-bold text-charcoal">
                  {value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
