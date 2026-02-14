import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/luxury/BackToTop";
import Footer from "@/components/luxury/Footer";
import QueryProvider from "@/providers/QueryProvider";

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "PEARL — Timeless Lustre · Luxury Jewellery",
  description:
    "Discover exquisite, heirloom-quality pearl jewellery. Each piece is hand-selected for its radiance, shape, and timeless elegance.",
};

// ---------------------------------------------------------------------------
// Root Layout
// ---------------------------------------------------------------------------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable} relative h-full scroll-smooth`}>
      <body className="relative font-[family-name:var(--font-body)] antialiased">
        <QueryProvider>
          {children}
          <Footer />
          <BackToTop />
        </QueryProvider>
      </body>
    </html>
  );
}
