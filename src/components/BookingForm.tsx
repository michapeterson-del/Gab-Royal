"use client";

import { useEffect, useMemo, useState } from "react";
import type { Service } from "@/lib/types";
import { formatDuration } from "@/lib/types";

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type AvailabilityResponse = {
  open: boolean;
  slots: string[];
  error?: string;
};

type BookingResult =
  | { status: "idle" }
  | { status: "success"; startTime: string; endTime: string }
  | { status: "error"; message: string };

export default function BookingForm({ services }: { services: Service[] }) {
  const categories = useMemo(
    () => Array.from(new Set(services.map((s) => s.category))),
    [services]
  );

  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [salonOpen, setSalonOpen] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResult>({ status: "idle" });

  const selectedService = services.find((s) => s.id === serviceId) ?? null;

  useEffect(() => {
    setSlot(null);
    setSlots([]);
    setSlotsError(null);

    if (!serviceId || !date) return;

    let cancelled = false;
    setLoadingSlots(true);

    fetch(`/api/availability?date=${date}&serviceId=${serviceId}`)
      .then(async (res) => {
        const data: AvailabilityResponse = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setSlotsError(data.error ?? "Verfügbarkeit konnte nicht geladen werden.");
          setSalonOpen(true);
          return;
        }
        setSalonOpen(data.open);
        setSlots(data.slots);
      })
      .catch(() => {
        if (!cancelled) setSlotsError("Verfügbarkeit konnte nicht geladen werden.");
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [serviceId, date]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService || !date || !slot) return;

    setSubmitting(true);
    setResult({ status: "idle" });

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          date,
          startTime: slot,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          note,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({ status: "error", message: data.error ?? "Etwas ist schiefgelaufen." });
        if (res.status === 409) {
          setSlot(null);
          fetch(`/api/availability?date=${date}&serviceId=${serviceId}`)
            .then((r) => r.json())
            .then((d: AvailabilityResponse) => setSlots(d.slots ?? []));
        }
        return;
      }

      setResult({ status: "success", startTime: data.startTime, endTime: data.endTime });
    } catch {
      setResult({ status: "error", message: "Verbindung fehlgeschlagen. Bitte erneut versuchen." });
    } finally {
      setSubmitting(false);
    }
  }

  if (result.status === "success" && selectedService) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-cream/60 p-8 text-center">
        <h2 className="font-serif text-2xl text-ink">Termin bestätigt!</h2>
        <p className="mt-3 text-foreground/80">
          {selectedService.name} am{" "}
          <strong>
            {new Date(date).toLocaleDateString("de-DE", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </strong>{" "}
          von <strong>{result.startTime}</strong> bis <strong>{result.endTime}</strong> Uhr.
        </p>
        <p className="mt-2 text-sm text-foreground/60">
          Wir haben Ihre Buchung erhalten. Eine Bestätigung senden wir an {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-ink">Leistung</label>
        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gold/30 bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
        >
          {categories.map((category) => (
            <optgroup key={category} label={category}>
              {services
                .filter((s) => s.category === category)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {formatDuration(s.durationMin)} · ab {s.priceFrom} €
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink">Datum</label>
        <input
          type="date"
          min={todayStr()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-gold/30 bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      {date && (
        <div>
          <label className="block text-sm font-semibold text-ink">Uhrzeit</label>

          {loadingSlots && (
            <p className="mt-2 text-sm text-foreground/60">Verfügbare Zeiten werden geladen…</p>
          )}

          {!loadingSlots && slotsError && (
            <p className="mt-2 text-sm text-red-600">{slotsError}</p>
          )}

          {!loadingSlots && !slotsError && !salonOpen && (
            <p className="mt-2 text-sm text-foreground/60">
              An diesem Tag hat der Salon leider geschlossen. Bitte wählen Sie ein anderes Datum.
            </p>
          )}

          {!loadingSlots && !slotsError && salonOpen && slots.length === 0 && (
            <p className="mt-2 text-sm text-foreground/60">
              An diesem Tag sind für diese Leistung leider keine Termine mehr frei.
            </p>
          )}

          {!loadingSlots && !slotsError && salonOpen && slots.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {slots.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
                    slot === s
                      ? "border-gold bg-gold text-ink"
                      : "border-gold/30 text-ink hover:border-gold"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {slot && (
        <div className="space-y-4 border-t border-gold/20 pt-6">
          <div>
            <label className="block text-sm font-semibold text-ink">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gold/30 bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-ink">E-Mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gold/30 bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink">Telefon</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gold/30 bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink">
              Anmerkung <span className="font-normal text-foreground/50">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-lg border border-gold/30 bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </div>

          {result.status === "error" && (
            <p className="text-sm text-red-600">{result.message}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-gold disabled:opacity-60"
          >
            {submitting ? "Wird gebucht…" : "Termin verbindlich buchen"}
          </button>
        </div>
      )}
    </form>
  );
}
