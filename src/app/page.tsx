import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDuration } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const services = await prisma.service.findMany({
    orderBy: { priceFrom: "asc" },
    take: 6,
  });

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-28 md:py-36">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-light">
            Friseursalon in Stuttgart
          </span>
          <h1 className="max-w-2xl font-serif text-4xl leading-tight md:text-6xl">
            Schöne Haare beginnen bei <span className="text-gold-light">Gab Royal</span>
          </h1>
          <p className="max-w-xl text-lg text-cream/75">
            Ob Haarschnitt, Farbe, Dauerwelle oder Styling – bei uns bekommen
            Sie genau die Zeit, die Ihre Behandlung braucht. Termin in
            wenigen Klicks online buchen, ganz ohne Wartezeit.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/buchen"
              className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-gold-light"
            >
              Termin buchen
            </Link>
            <Link
              href="/leistungen"
              className="rounded-full border border-cream/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:border-gold-light hover:text-gold-light"
            >
              Leistungen ansehen
            </Link>
          </div>
        </div>
        <div className="section-divider absolute bottom-0 left-0 right-0" />
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
        {[
          {
            title: "Passende Terminlänge",
            text: "Jede Behandlung bekommt genau die Zeit, die sie braucht – keine Hetze, keine Überschneidungen.",
          },
          {
            title: "Online buchen",
            text: "Wählen Sie Leistung, Datum und Uhrzeit – Sie sehen sofort, welche Termine wirklich frei sind.",
          },
          {
            title: "Erfahrenes Team",
            text: "Unsere Stylistinnen und Stylisten beraten Sie individuell zu Schnitt, Farbe und Pflege.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-gold/15 p-6">
            <h3 className="font-serif text-xl text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-cream/60 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
                Unsere Leistungen
              </span>
              <h2 className="mt-2 font-serif text-3xl text-ink">Beliebte Behandlungen</h2>
            </div>
            <Link href="/leistungen" className="text-sm font-semibold text-gold hover:text-gold-light">
              Alle Leistungen ansehen →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col justify-between rounded-2xl bg-background p-6 shadow-sm ring-1 ring-gold/10"
              >
                <div>
                  <h3 className="font-serif text-lg text-ink">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                    {service.description}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-foreground/60">{formatDuration(service.durationMin)}</span>
                  <span className="font-semibold text-gold">ab {service.priceFrom} €</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-ink md:text-4xl">
          Bereit für Ihren neuen Look?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-foreground/70">
          Buchen Sie Ihren Termin online – passend zur Dauer Ihrer gewählten
          Behandlung, damit für Sie und alle anderen Gäste genug Zeit bleibt.
        </p>
        <Link
          href="/buchen"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-gold"
        >
          Jetzt Termin sichern
        </Link>
      </section>
    </div>
  );
}
