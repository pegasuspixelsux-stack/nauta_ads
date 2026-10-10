"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tarjeta con efecto de brillo. Con mouse, al pasar el cursor. En pantallas táctiles (donde no
 * existe hover) se ilumina sola mientras ocupa la franja central de la pantalla al hacer scroll.
 */
export function GlowCard({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.dataset.glow = String(entry.isIntersecting);
      },
      { rootMargin: "-38% 0px -38% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      data-glow="false"
      className={cn(
        "group transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out-expo",
        // Clases completas a propósito: Tailwind no detecta las que se arman con variables.
        "hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_0_1px_var(--color-accent),0_0_36px_0_color-mix(in_oklab,var(--color-accent)_55%,transparent)]",
        "[@media(hover:none)]:data-[glow=true]:-translate-y-1 [@media(hover:none)]:data-[glow=true]:border-accent [@media(hover:none)]:data-[glow=true]:shadow-[0_0_0_1px_var(--color-accent),0_0_36px_0_color-mix(in_oklab,var(--color-accent)_55%,transparent)]",
        className,
      )}
    >
      {children}
    </li>
  );
}
