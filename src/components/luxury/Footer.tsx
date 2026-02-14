"use client";

import Link from "next/link";
import { Facebook, MessageCircle, ShoppingBag, ShieldCheck, CreditCard, Gem } from "lucide-react";
import { EXTERNAL_LINKS } from "@/constants/footer";

export default function Footer() {
  return (
    <footer className="bg-charcoal pt-20 pb-10 text-pearl-warm">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Section 1: Socials */}
          <div className="space-y-6">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wide text-white">
              Connect with Us
            </h3>
            <p className="text-sm leading-relaxed opacity-70">
              Join our community and stay updated with the latest collections and exclusive offers.
            </p>
            <div className="flex gap-4">
              <a
                href={EXTERNAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-gold hover:text-charcoal"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={EXTERNAL_LINKS.line}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-gold hover:text-charcoal"
                aria-label="Line"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Section 2: Marketplaces */}
          <div className="space-y-6">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wide text-white">
              Official Stores
            </h3>
            <p className="text-sm leading-relaxed opacity-70">
              Shop comfortably on your preferred platforms with verified authenticity.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={EXTERNAL_LINKS.shopee}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-white/10 p-3 transition-all hover:border-gold/50 hover:bg-white/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EE4D2D] text-white">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium transition-colors group-hover:text-gold">Shopee Official</span>
              </a>
              <a
                href={EXTERNAL_LINKS.lazada}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-white/10 p-3 transition-all hover:border-gold/50 hover:bg-white/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0f146d] text-white">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium transition-colors group-hover:text-gold">Lazada Mall</span>
              </a>
            </div>
          </div>

          {/* Section 3: Policy */}
          <div className="space-y-6">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wide text-white">
              Customer Care
            </h3>
            <ul className="space-y-4 text-sm opacity-70">
              <li>
                <Link href="/shipping" className="transition-colors hover:text-gold hover:opacity-100">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-gold hover:opacity-100">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-gold hover:opacity-100">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-gold hover:opacity-100">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 4: Trust */}
          <div className="space-y-6">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wide text-white">
              Secure Shopping
            </h3>
            <p className="text-sm leading-relaxed opacity-70">
              Guaranteed authenticity and secure payment processing for your peace of mind.
            </p>
            <div className="flex flex-wrap gap-4 text-gold/60">
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="h-8 w-8 opacity-80" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Secure Pay</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="h-8 w-8 opacity-80" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Gem className="h-8 w-8 opacity-80" />
                <span className="text-[10px] font-bold uppercase tracking-wider">GIA Cert</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-20 border-t border-white/5 pt-8 text-center">
          <p className="text-xs tracking-widest opacity-40">
            &copy; {new Date().getFullYear()} NJ PEARL. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
