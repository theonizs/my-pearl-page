export function easeOutQuint(t: number, b: number, c: number, d: number): number {
  t /= d;
  t--;
  return c * (Math.pow(t, 5) + 1) + b;
}

const preventDefault = (e: Event) => {
  e.preventDefault();
};

const keys: { [key: string]: number } = {
  ArrowLeft: 1,
  ArrowRight: 1,
  ArrowUp: 1,
  ArrowDown: 1,
  Space: 1,
  PageUp: 1,
  PageDown: 1,
  Home: 1,
  End: 1,
};

const preventDefaultForScrollKeys = (e: KeyboardEvent) => {
  if (keys[e.code]) {
    preventDefault(e);
    return false;
  }
};

let isLocked = false;

// Modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
  // @ts-ignore
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}

const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent =
  typeof document !== "undefined" && "onwheel" in document.createElement("div")
    ? "wheel"
    : "mousewheel";

export function lockScroll() {
  if (typeof window === "undefined" || isLocked) return;
  isLocked = true;
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

export function unlockScroll() {
  if (typeof window === "undefined" || !isLocked) return;
  isLocked = false;
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  // @ts-ignore
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  // @ts-ignore
  window.removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

export function smoothScrollTo(targetY: number, duration: number = 1000) {
  if (typeof window === "undefined") return;

  // 1. Lock user interaction
  lockScroll();

  const startY = window.pageYOffset;
  const distance = targetY - startY;
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    const run = easeOutQuint(timeElapsed, startY, distance, duration);

    window.scrollTo(0, run);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      // 2. Unlock when done
      unlockScroll();
    }
  }

  requestAnimationFrame(animation);
}
