"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface GalleryProduct {
  name: string;
  pearlType: string;
  price: string;
}

interface LuxuryGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  product?: GalleryProduct;
  layoutId?: string;
}

// ---------------------------------------------------------------------------
// Swipe helpers
// ---------------------------------------------------------------------------
const swipeConfidenceThreshold = 8000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

// ---------------------------------------------------------------------------
// Slide variants — direction 0 = fade only (first image), ±1 = slide
// ---------------------------------------------------------------------------
const slideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? 600 : -600,
    opacity: 0,
    scale: direction === 0 ? 1 : 0.92,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction === 0 ? 0 : direction < 0 ? 600 : -600,
    opacity: 0,
    scale: direction === 0 ? 1 : 0.92,
  }),
};

// ---------------------------------------------------------------------------
// Overlay controls entrance (delayed fade-in)
// ---------------------------------------------------------------------------
const controlsFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 0.4 } },
};

const productInfoSlide = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.35,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LuxuryGalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  product,
  layoutId,
}: LuxuryGalleryModalProps) {
  const [[page, direction], setPage] = useState([initialIndex, 0]);
  const [mounted, setMounted] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const lastTapRef = useRef<number>(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Infinite loop index
  const imageIndex = ((page % images.length) + images.length) % images.length;

  // ── Bug Fix #1: Always reset to initialIndex when modal opens ──────
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // direction = 0 → triggers fade-in only, no slide (Bug Fix #3)
      setPage([initialIndex, 0]);
      setZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Bug Fix #4: Auto-scroll thumbnails to active item ──────────────
  useEffect(() => {
    if (!thumbnailsRef.current) return;
    const activeThumb = thumbnailsRef.current.children[imageIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [imageIndex]);

  const paginate = useCallback(
    (newDirection: number) => {
      if (zoomed) return;
      setPage([page + newDirection, newDirection]);
    },
    [page, zoomed]
  );

  const jumpTo = (index: number) => {
    if (zoomed) setZoomed(false);
    const diff = index - imageIndex;
    if (diff !== 0) {
      setPage([page + diff, diff > 0 ? 1 : -1]);
    }
  };

  // Double-tap to zoom (mobile)
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setZoomed((prev) => !prev);
    }
    lastTapRef.current = now;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, paginate, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stone-900/60 backdrop-blur-2xl"
          onClick={onClose}
        >
          {/* ── Close Button (Delayed Fade-in) ─────────────────── */}
          <motion.button
            variants={controlsFade}
            initial="hidden"
            animate="visible"
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-[110] rounded-full bg-white/10 p-3 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:right-8 sm:top-8"
          >
            <X className="h-6 w-6 sm:h-7 sm:w-7" />
          </motion.button>

          {/* ── Main Content Wrapper (Parent) ──────────────────── */}
          <div
            className="relative flex h-full w-full max-w-7xl flex-col items-center justify-center px-4 py-6 sm:py-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Main Image Area (Flexible Hero) ──────────────── */}
            <div className="relative flex min-h-0 w-full max-w-5xl flex-grow flex-col items-center justify-center">
              <div
                className="relative h-full w-full overflow-hidden rounded-xl"
                onClick={handleDoubleTap}
              >
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={page}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.4, ease: "easeInOut" },
                      scale: { duration: 0.4, ease: "easeInOut" },
                    }}
                    drag={zoomed ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                    onDragEnd={(e, { offset, velocity }: PanInfo) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1);
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1);
                      }
                    }}
                    className="absolute inset-0 h-full w-full"
                  >
                    <motion.div
                      animate={{ scale: zoomed ? 2 : 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 25 }}
                      className="relative h-full w-full origin-center"
                    >
                      <Image
                        src={images[imageIndex]}
                        alt={`Gallery ${imageIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, 80vw"
                        priority
                        draggable={false}
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Zoom indicator */}
                {zoomed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70"
                  >
                    Double-tap to exit zoom
                  </motion.div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && !zoomed && (
                  <>
                    <motion.button
                      variants={controlsFade}
                      initial="hidden"
                      animate="visible"
                      onClick={(e) => {
                        e.stopPropagation();
                        paginate(-1);
                      }}
                      className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-black/40 hover:text-white sm:left-4 sm:p-3"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                    </motion.button>
                    <motion.button
                      variants={controlsFade}
                      initial="hidden"
                      animate="visible"
                      onClick={(e) => {
                        e.stopPropagation();
                        paginate(1);
                      }}
                      className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-black/40 hover:text-white sm:right-4 sm:p-3"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            {/* ── Bottom Section (Info + Thumbnails) ─ Fixed/Shrinkable ── */}
            <div className="flex w-full max-w-2xl flex-shrink-0 flex-col items-center">
              {/* Product Info */}
              {product && (
                <motion.div
                  variants={productInfoSlide}
                  initial="hidden"
                  animate="visible"
                  className="mt-4 text-center sm:mt-6"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/80">
                    {product.pearlType}
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold tracking-wide text-white sm:text-2xl">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium tracking-widest text-gold">
                    {product.price}
                  </p>
                </motion.div>
              )}

              {/* Pagination Dots */}
              {images.length > 1 && (
                <div className="mt-4 flex justify-center gap-2 pt-1">
                  {images.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => jumpTo(idx)}
                      animate={{
                        width: idx === imageIndex ? 24 : 8,
                        backgroundColor:
                          idx === imageIndex
                            ? "rgb(183, 148, 97)" // gold
                            : "rgba(255, 255, 255, 0.3)",
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="h-2 rounded-full"
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Thumbnails Strip */}
              {images.length > 1 && (
                <div
                  ref={thumbnailsRef}
                  className="mt-4 py-2 flex max-w-full gap-2.5 overflow-x-auto px-4 pb-2 scrollbar-none"
                >
                  {images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => jumpTo(idx)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 sm:h-[72px] sm:w-[72px] ${
                        idx === imageIndex
                          ? "ring-2 ring-gold ring-offset-2 ring-offset-stone-900 opacity-100"
                          : "opacity-40 hover:opacity-80"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
