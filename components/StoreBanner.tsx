import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

const photo =
  "https://images.unsplash.com/photo-1635740579241-8f5c18c75786?auto=format&fit=crop&w=1200&q=80";

/** Banner publicitario de la tienda náutica: cabullería, fondeo y herrajes. */
export function StoreBanner() {
  return (
    <section
      aria-labelledby="store-banner-title"
      className="w-full bg-accent text-white"
    >
      {/* Los colores van fijos (no usan la escala slate) para que el banner sea azul en ambos temas. */}
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-6 py-12 md:px-12 lg:grid-cols-2">
        <div className="space-y-4">
          <span className="inline-block rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase">
            Equipamiento &amp; Suministros
          </span>
          <h2
            id="store-banner-title"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Cabullería, Fondeo y Herrajes de Alta Mar
          </h2>
          <p className="text-base leading-relaxed text-white/90 sm:text-lg">
            Todo lo que tu velero o yate necesita en un solo lugar: cabos de altas prestaciones
            (drizas y escotas), cadenas calibradas, anclas de máxima sujeción y herrajes en acero
            inoxidable 316 para resistir las exigencias de la navegación moderna.
          </p>
          <div className="pt-4">
            <Link
              href="/motores"
              className={`${buttonStyles("primary", "lg")} !bg-white !text-accent hover:!bg-sky-50`}
            >
              Explorar Catálogo de Tienda
            </Link>
          </div>
        </div>

        <div className="relative h-64 w-full overflow-hidden rounded-xl border border-white/30 bg-sky-800 shadow-2xl sm:h-80 lg:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt="Ancla y cabo náuticos"
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
