import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_CART_STORAGE_KEY: z.string().default("luxury-pearl-cart"),
  
  // 🔐 ตัวแปร Server-side ให้ยอมรับ undefined ได้ถ้าเป็นฝั่ง Client
  STRIPE_SECRET_KEY: z.string().min(1).optional().or(z.literal("")),
});

export type Env = z.infer<typeof envSchema>;

function createEnv(): Env {
  const isServer = typeof window === "undefined";

  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CART_STORAGE_KEY: process.env.NEXT_PUBLIC_CART_STORAGE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
    throw new Error("Invalid environment variables — check server logs.");
  }

  // 🛡️ Extra Check: ถ้าอยู่บน Server แต่ดันไม่มี Secret Key ให้ด่าแรงๆ
  if (isServer && !parsed.data.STRIPE_SECRET_KEY) {
    console.error("❌ Missing STRIPE_SECRET_KEY on server-side!");
    throw new Error("STRIPE_SECRET_KEY is required on server.");
  }

  return parsed.data;
}

export const env = createEnv();