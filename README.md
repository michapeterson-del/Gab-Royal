# Gab Royal – Friseursalon Website

Website für den Friseursalon **Gab Royal** mit Online-Terminbuchung.
Gebaut mit Next.js (App Router, TypeScript, Tailwind CSS) und
Prisma/SQLite als Datenbank.

## Funktionen

- **Startseite** mit Vorstellung des Salons und beliebten Leistungen
- **Leistungen** (`/leistungen`): alle Behandlungen (Haarschnitt, Färben,
  Dauerwelle, Strähnen, Glättung, Styling, …) mit Preis und Dauer
- **Termin buchen** (`/buchen`): Leistung, Datum und Uhrzeit wählen –
  freie Zeiten werden automatisch anhand der Behandlungsdauer berechnet,
  sodass sich keine Termine überschneiden

## Lokal starten

```bash
npm install
cp .env.example .env    # lokale Einstellungen (wird nicht committet)
npx prisma db push     # legt die SQLite-Datenbank an
npm run db:seed        # befüllt die Leistungen
npm run dev
```

Danach [http://localhost:3000](http://localhost:3000) im Browser öffnen.

> Hinweis: GitHub zeigt hier nur den Quellcode an. Um die Website
> tatsächlich zu sehen, muss sie lokal gestartet (siehe oben) oder z. B.
> auf [Vercel](https://vercel.com/new) deployt werden.

## Projektstruktur

- `src/app` – Seiten und API-Routen (Next.js App Router)
- `src/components` – UI-Komponenten (Header, Footer, Buchungsformular)
- `src/lib` – Datenbankzugriff und Verfügbarkeitslogik
- `prisma/schema.prisma` – Datenmodell für Leistungen und Buchungen
- `prisma/seed.ts` – Beispiel-Leistungen zum Befüllen der Datenbank
