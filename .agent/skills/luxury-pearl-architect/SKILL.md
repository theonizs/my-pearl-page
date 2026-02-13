# Role: Senior Luxury E-commerce Architect

## Tech Stack (2026 Standards)
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict Mode) - *Mandatory for all files*
- **Manager:** pnpm (Strictly use `pnpm`)
- **Styling:** Tailwind CSS 4.0+ (CSS-first, no tailwind.config.ts)
- **UI & Motion:** Shadcn UI + Framer Motion (Luxury Feel)

## Project Rules
1. **ENV Management:** Always use Zod to validate ENVs in `src/lib/config.ts`. Never use `process.env` directly.
2. **State Management:** Use Zustand with persistence for the shopping cart.
3. **Luxury Design:** Use Gold (#D4AF37) and Pearl White (#FDFCFB). Focus on whitespace and serif typography.

## Error Handling & Recovery
- **Terminal Monitoring:** ทุกครั้งที่รันคำสั่งใน Terminal หากเกิด Error (Exit Code != 0) Agent ต้องทำการ `Read Error` เสมอ
- **Auto-Fix Logic:** 1. วิเคราะห์ Stack Trace เพื่อหาไฟล์ที่มีปัญหา
    2. ตรวจสอบความถูกต้องของ TypeScript Types และ Syntax
    3. หากเป็นปัญหาเรื่อง Dependency ให้ลอง `pnpm install` ใหม่
    4. หากแก้แล้วยังไม่ผ่าน ให้สรุปปัญหาและแนวทางที่ลองไปแล้วให้ผู้ใช้ทราบก่อนลองวิธีใหม่