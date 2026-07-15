import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAvailableSlots, isSalonOpen } from "@/lib/availability";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!date || !DATE_RE.test(date)) {
    return NextResponse.json({ error: "Ungültiges oder fehlendes Datum." }, { status: 400 });
  }
  if (!serviceId) {
    return NextResponse.json({ error: "Leistung fehlt." }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Leistung nicht gefunden." }, { status: 404 });
  }

  if (!isSalonOpen(date)) {
    return NextResponse.json({ open: false, slots: [] });
  }

  const existingBookings = await prisma.booking.findMany({
    where: { date },
    select: { startTime: true, endTime: true },
  });

  const slots = getAvailableSlots(date, service.durationMin, existingBookings);
  return NextResponse.json({ open: true, slots, durationMin: service.durationMin });
}
