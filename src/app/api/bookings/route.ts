import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { minutesToTime, timeToMinutes, isSalonOpen } from "@/lib/availability";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { serviceId, customerName, customerEmail, customerPhone, note, date, startTime } = body;

  if (
    typeof serviceId !== "string" ||
    typeof customerName !== "string" ||
    !customerName.trim() ||
    typeof customerEmail !== "string" ||
    !EMAIL_RE.test(customerEmail) ||
    typeof customerPhone !== "string" ||
    !customerPhone.trim() ||
    typeof date !== "string" ||
    !DATE_RE.test(date) ||
    typeof startTime !== "string" ||
    !TIME_RE.test(startTime)
  ) {
    return NextResponse.json({ error: "Bitte alle Pflichtfelder korrekt ausfüllen." }, { status: 400 });
  }

  if (!isSalonOpen(date)) {
    return NextResponse.json({ error: "Der Salon hat an diesem Tag geschlossen." }, { status: 409 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Leistung nicht gefunden." }, { status: 404 });
  }

  const start = timeToMinutes(startTime);
  const end = start + service.durationMin;
  const endTime = minutesToTime(end);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findMany({
        where: { date },
        select: { startTime: true, endTime: true },
      });

      const overlaps = existing.some((b) =>
        rangesOverlap(start, end, timeToMinutes(b.startTime), timeToMinutes(b.endTime))
      );
      if (overlaps) {
        throw new Error("SLOT_TAKEN");
      }

      return tx.booking.create({
        data: {
          serviceId,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          note: typeof note === "string" ? note.trim() || null : null,
          date,
          startTime,
          endTime,
        },
        include: { service: true },
      });
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return NextResponse.json(
        { error: "Dieser Termin wurde gerade vergeben. Bitte wählen Sie eine andere Zeit." },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Die Buchung konnte nicht gespeichert werden." }, { status: 500 });
  }
}
