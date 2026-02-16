/**
 * Native CSS-first smooth scroll utility.
 * Uses window.scrollTo({ behavior: 'smooth' }) for browser-native
 * smooth scrolling instead of JS requestAnimationFrame loops.
 *
 * Includes heuristics to prevent "instant jump" issues:
 * 1. Reduced Motion check for accessibility
 * 2. setTimeout(..., 0) to allow event loop to clear
 */

export function smoothScrollTo(targetY: number) {
  if (typeof window === "undefined") return;

  // 1. Accessibility Check
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 2. Event Loop Delay Hack
  // Wraps the scroll in a timeout to ensure any previous events (like clicks)
  // have fully propagated and the browser is ready to accept a new scroll command.
  setTimeout(() => {
    window.scrollTo({
      top: targetY,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, 0);
}
