import type { LucideIcon } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export interface SectionItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

/** Plantilla de las secciones informativas del navbar (motores, servicios, guía, eventos). */
export function SectionPage({
  title,
  intro,
  items,
  note,
}: {
  title: string;
  intro: string;
  items: SectionItem[];
  note?: string;
}) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-12 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">{title}</h1>
        <p className="mt-3 max-w-2xl text-slate-400">{intro}</p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title: itemTitle, text }) => (
            <li
              key={itemTitle}
              className="rounded-2xl border border-slate-800/80 bg-surface p-6 transition-colors hover:border-accent"
            >
              <Icon className="size-6 text-accent" strokeWidth={1.5} />
              <h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-100">{itemTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
            </li>
          ))}
        </ul>

        {note && <p className="mt-10 text-sm text-slate-500">{note}</p>}
      </main>
      <Footer />
    </>
  );
}
