import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Termin buchen | Gab Royal",
  description: "Buchen Sie online Ihren Termin bei Gab Royal – passend zur Dauer Ihrer Behandlung.",
};

export default async function BuchenPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
          Online-Buchung
        </span>
        <h1 className="mt-2 font-serif text-4xl text-ink">Termin buchen</h1>
        <p className="mx-auto mt-3 max-w-xl text-foreground/70">
          Wählen Sie Ihre Leistung, ein Datum und eine freie Uhrzeit. Die
          verfügbaren Zeiten berücksichtigen automatisch die Dauer der
          Behandlung, damit sich nichts überschneidet.
        </p>
      </div>

      <div className="mt-12">
        <BookingForm services={services} />
      </div>
    </div>
  );
}
