export default function Footer() {
  return (
    <footer id="kontakt" className="border-t border-gold/20 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-xl text-gold-light">Gab Royal</h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Ihr Friseursalon für Haarschnitt, Farbe, Dauerwelle und Styling –
            persönlich, professionell und mit viel Liebe zum Detail.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-light">
            Öffnungszeiten
          </h4>
          <ul className="mt-3 space-y-1 text-sm text-cream/70">
            <li className="flex justify-between gap-6">
              <span>Montag</span>
              <span>Ruhetag</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Dienstag – Freitag</span>
              <span>9:00 – 18:00</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Samstag</span>
              <span>9:00 – 14:00</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Sonntag</span>
              <span>Geschlossen</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-light">
            Kontakt
          </h4>
          <ul className="mt-3 space-y-1 text-sm text-cream/70">
            <li>Königstraße 12, 70173 Stuttgart</li>
            <li>Tel: 0711 123 456 78</li>
            <li>info@gab-royal.de</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Gab Royal Friseursalon. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
