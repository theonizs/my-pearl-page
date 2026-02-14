"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Check,
  Package,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Navbar from "@/components/luxury/Navbar";
import { shimmer, toBase64 } from "@/lib/shimmer";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const STEPS = [
  { id: 1, label: "Order Summary", icon: Package },
  { id: 2, label: "Shipping & Payment", icon: CreditCard },
  { id: 3, label: "Confirmation", icon: Check },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

// ---------------------------------------------------------------------------
// Stepper
// ---------------------------------------------------------------------------
function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-12 flex items-center justify-center gap-0">
      {STEPS.map((step, idx) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  isCompleted
                    ? "border-gold bg-gold text-white"
                    : isActive
                    ? "border-gold bg-transparent text-gold"
                    : "border-charcoal/15 bg-transparent text-charcoal/30"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`hidden text-[10px] font-bold uppercase tracking-[0.2em] sm:inline ${
                  isActive
                    ? "text-charcoal"
                    : isCompleted
                    ? "text-gold"
                    : "text-charcoal/30"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className="mx-4 h-[1px] w-12 sm:w-20">
                <div
                  className={`h-full transition-colors duration-500 ${
                    isCompleted ? "bg-gold" : "bg-charcoal/10"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Order Summary
// ---------------------------------------------------------------------------
function OrderSummaryStep({
  onNext,
}: {
  onNext: () => void;
}) {
  const { items, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="mb-6 h-16 w-16 text-charcoal/15" />
        <h3 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-bold text-charcoal">
          Your cart is empty
        </h3>
        <p className="mb-8 text-sm text-charcoal/50">
          Add some beautiful pieces to your collection.
        </p>
        <Link
          href="/products-list"
          className="rounded-full bg-charcoal px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gold"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl font-bold text-charcoal">
        Review Your Order
      </h2>

      <div className="space-y-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-5 rounded-2xl border border-charcoal/5 bg-white/50 p-4 backdrop-blur-sm"
          >
            {/* Image */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-pearl-warm">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="96px"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(96, 96))}`}
              />
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h4 className="font-[family-name:var(--font-display)] text-base font-semibold text-charcoal">
                  {item.name}
                </h4>
                {item.metadata?.pearlType && (
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-charcoal/40">
                    {item.metadata.pearlType}
                    {item.metadata.length && ` · ${item.metadata.length}`}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-3 mt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                {/* Quantity */}
                <div className="flex items-center gap-3 rounded-full border border-charcoal/10 px-3 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-sm text-charcoal/60 hover:text-gold"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="min-w-[1.25rem] text-center text-sm font-bold text-charcoal tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-sm text-charcoal/60 hover:text-gold"
                  >
                    +
                  </button>
                </div>

                {/* Price & Remove */}
                <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-sm font-semibold text-charcoal">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[10px] font-bold uppercase tracking-widest text-charcoal/30 transition-colors hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-charcoal py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-gold"
      >
        Continue to Shipping
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Shipping & Payment
// ---------------------------------------------------------------------------
function ShippingPaymentStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl font-bold text-charcoal">
        Shipping & Payment
      </h2>

      {/* Shipping Form */}
      <div className="mb-10 space-y-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/50">
          Shipping Address
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="First Name"
            className="rounded-xl border border-charcoal/10 bg-white/50 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="rounded-xl border border-charcoal/10 bg-white/50 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
        </div>
        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-xl border border-charcoal/10 bg-white/50 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
        <input
          type="text"
          placeholder="Address Line 1"
          className="w-full rounded-xl border border-charcoal/10 bg-white/50 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
        <input
          type="text"
          placeholder="Address Line 2 (Optional)"
          className="w-full rounded-xl border border-charcoal/10 bg-white/50 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            type="text"
            placeholder="City"
            className="rounded-xl border border-charcoal/10 bg-white/50 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
          <input
            type="text"
            placeholder="State / Province"
            className="rounded-xl border border-charcoal/10 bg-white/50 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
          <input
            type="text"
            placeholder="Postal Code"
            className="rounded-xl border border-charcoal/10 bg-white/50 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
        </div>
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full rounded-xl border border-charcoal/10 bg-white/50 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
      </div>

      {/* Payment Method */}
      <div className="mb-10 space-y-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/50">
          Payment Method
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button className="flex items-center gap-3 rounded-xl border-2 border-gold bg-gold/5 px-5 py-4 text-sm font-semibold text-charcoal transition-all">
            <CreditCard className="h-5 w-5 text-gold" />
            Credit / Debit Card
          </button>
          <button className="flex items-center gap-3 rounded-xl border-2 border-charcoal/10 px-5 py-4 text-sm font-semibold text-charcoal/60 transition-all hover:border-gold hover:text-charcoal">
            <Truck className="h-5 w-5" />
            Cash on Delivery
          </button>
        </div>

        {/* Card inputs */}
        <div className="space-y-4 rounded-2xl border border-charcoal/5 bg-white/40 p-6 backdrop-blur-sm">
          <input
            type="text"
            placeholder="Card Number"
            className="w-full rounded-xl border border-charcoal/10 bg-white px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM / YY"
              className="rounded-xl border border-charcoal/10 bg-white px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
            <input
              type="text"
              placeholder="CVC"
              className="rounded-xl border border-charcoal/10 bg-white px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 rounded-full border border-charcoal/10 px-8 py-4 text-xs font-bold uppercase tracking-widest text-charcoal/60 transition-colors hover:border-charcoal hover:text-charcoal sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-3 rounded-full bg-charcoal py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-gold"
        >
          Place Order
          <ShieldCheck className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Confirmation
// ---------------------------------------------------------------------------
function ConfirmationStep() {
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  if (!cleared) {
    clearCart();
    setCleared(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {/* Success Icon */}
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gold/10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <Check className="h-10 w-10 text-gold" />
        </motion.div>
      </div>

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-3xl font-bold text-charcoal">
        Thank You
      </h2>
      <p className="mb-2 text-base text-charcoal/60">
        Your order has been placed successfully.
      </p>
      <p className="mb-10 text-sm text-charcoal/40">
        A confirmation email has been sent to your inbox.
      </p>

      {/* Trust Signals */}
      <div className="mb-10 flex flex-wrap justify-center gap-8">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/30">
          <ShieldCheck className="h-4 w-4 text-gold/60" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/30">
          <Truck className="h-4 w-4 text-gold/60" />
          <span>Free Shipping</span>
        </div>
      </div>

      <Link
        href="/"
        className="rounded-full bg-charcoal px-10 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gold"
      >
        Continue Shopping
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Order Totals Sidebar
// ---------------------------------------------------------------------------
function OrderTotals({
  currentStep,
}: {
  currentStep: number;
}) {
  const { items, totalPrice, totalItems } = useCart();
  const shipping = 0; // Free shipping
  const total = totalPrice + shipping;

  if (currentStep === 3) return null;

  return (
    <div className="sticky top-32 rounded-2xl border border-charcoal/5 bg-white/40 p-8 backdrop-blur-sm">
      <h3 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/50">
        Order Totals
      </h3>

      {/* Items preview */}
      <div className="mb-6 max-h-48 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="truncate text-charcoal/70">
              {item.name} <span className="text-charcoal/40">×{item.quantity}</span>
            </span>
            <span className="ml-3 flex-shrink-0 font-medium text-charcoal">
              ${(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-charcoal/5 pt-6">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal/50">Subtotal ({totalItems} items)</span>
          <span className="font-medium text-charcoal">
            ${totalPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-charcoal/50">Shipping</span>
          <span className="font-medium text-gold">Complimentary</span>
        </div>
      </div>

      <div className="mt-6 flex justify-between border-t border-charcoal/10 pt-6">
        <span className="text-sm font-bold uppercase tracking-widest text-charcoal">
          Total
        </span>
        <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-charcoal">
          ${total.toLocaleString()}
        </span>
      </div>

      {/* Trust */}
      <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-charcoal/25">
        <ShieldCheck className="h-4 w-4 text-gold/40" />
        <span>Secure SSL Checkout</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-pearl-warm">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-32 pb-24 lg:px-12">
        {/* Back to cart */}
        {currentStep < 3 && (
          <div className="mb-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal/40 hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Stepper */}
        <Stepper currentStep={currentStep} />

        {/* 2-column layout */}
        <div
          className={`grid gap-12 ${
            currentStep === 3
              ? "grid-cols-1"
              : "grid-cols-1 lg:grid-cols-[1fr_360px]"
          }`}
        >
          {/* Left: Active Step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {currentStep === 1 && <OrderSummaryStep onNext={nextStep} />}
              {currentStep === 2 && (
                <ShippingPaymentStep onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 3 && <ConfirmationStep />}
            </motion.div>
          </AnimatePresence>

          {/* Right: Sticky Order Totals */}
          {currentStep < 3 && <OrderTotals currentStep={currentStep} />}
        </div>
      </main>
    </div>
  );
}
