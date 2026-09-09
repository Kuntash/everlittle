import { useEffect, useRef } from "react";
export function useLandingMotion() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      root
        .querySelectorAll(".reveal-pending")
        .forEach((el) => el.classList.remove("reveal-pending"));
      if (reduced.matches || !("IntersectionObserver" in window)) {
        root.classList.remove("motion-ready");
        return;
      }
      root.classList.add("motion-ready");
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              entry.target.classList.remove("reveal-pending");
              observer?.unobserve(entry.target);
            }
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -24px 0px",
        },
      );
      root
        .querySelectorAll<HTMLElement>(
          ".memory-path,.privacy-block,.pricing-section,.journal-section,.final-cta",
        )
        .forEach((el) => {
          el.classList.add("reveal-pending");
          observer?.observe(el);
        });
    };
    setup();
    reduced.addEventListener("change", setup);
    // Keyboard users never have to wait for a reveal to reach a focused control.
    const focus = (e: FocusEvent) => {
      const section = (e.target as HTMLElement).closest(".reveal-pending");
      if (section) {
        section.classList.remove("reveal-pending");
        section.classList.add("is-revealed");
        observer?.unobserve(section);
      }
    };
    root.addEventListener("focusin", focus);
    return () => {
      observer?.disconnect();
      reduced.removeEventListener("change", setup);
      root.removeEventListener("focusin", focus);
      root.classList.remove("motion-ready");
    };
  }, []);
  return ref;
}
