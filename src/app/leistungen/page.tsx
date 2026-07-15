import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatDuration } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leistungen | Gab Royal",
  description: "Alle Leistungen von Gab Royal mit Preis und Behandlungsdauer.",
};

export default async function LeistungenPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const categories = Array.from(new Set(services.map((s) => s.category)));

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
          Preise & Dauer
        </span>
        <h1 className="mt-2 font-serif text-4xl text-ink">Unsere Leistungen</h1>
        <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
          Jede Behandlung ist mit ihrer Dauer hinterlegt – bei der
          Online-Buchung wird automatisch geprüft, dass genug Zeit für Sie
          eingeplant wird und sich keine Termine überschneiden.
        </p>
      </div>

      <div className="mt-14 space-y-14">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="border-b border-gold/20 pb-3 font-serif text-2xl text-ink">
              {category}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {services
                .filter((s) => s.category === category)
                .map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start justify-between gap-4 rounded-xl border border-gold/15 p-5"
                  >
                    <div>
                      <h3 className="font-medium text-ink">{service.name}</h3>
                      <p className="mt-1 text-sm text-foreground/65">{service.description}</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-foreground/50">
                        Dauer: {formatDuration(service.durationMin)}
                      </p>
                    </div>
                    <span className="whitespace-nowrap font-semibold text-gold">
                      ab {service.priceFrom} €
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/buchen"
          className="inline-block rounded-full bg-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-gold"
        >
          Termin buchen
        </Link>
      </div>
    </div>
  );
}
