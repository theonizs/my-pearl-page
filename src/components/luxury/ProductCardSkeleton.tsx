import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gold/10 bg-[#FFFDF8]">
      {/* Image Area */}
      <div className="relative flex aspect-[3/4] w-full items-center justify-center animate-pulse bg-pearl-warm/40">
        <ImageIcon className="h-12 w-12 text-gold/20" />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col space-y-3 px-4 py-5">
        {/* Badge Placeholder */}
        <div className="h-4 w-16 animate-pulse rounded bg-pearl-warm/60" />

        <div className="flex-1 space-y-2">
          {/* Title Placeholder */}
          <div className="h-5 w-3/4 animate-pulse rounded bg-pearl-warm/60" />
          {/* Description Placeholder (shorter line) */}
          <div className="h-4 w-1/2 animate-pulse rounded bg-pearl-warm/60" />
        </div>

        {/* Price Placeholder */}
        <div className="h-4 w-20 animate-pulse rounded bg-pearl-warm/60" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={
        className ||
        "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
