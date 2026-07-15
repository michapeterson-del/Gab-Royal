import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    name: "Damenhaarschnitt",
    description: "Waschen, Schneiden, Föhnen – individuell auf Ihre Wünsche abgestimmt.",
    category: "Schneiden",
    durationMin: 45,
    priceFrom: 45,
  },
  {
    name: "Herrenhaarschnitt",
    description: "Klassischer oder moderner Schnitt inkl. Waschen und Styling.",
    category: "Schneiden",
    durationMin: 30,
    priceFrom: 30,
  },
  {
    name: "Kinderhaarschnitt",
    description: "Für unsere jüngsten Gäste bis 12 Jahre.",
    category: "Schneiden",
    durationMin: 25,
    priceFrom: 20,
  },
  {
    name: "Waschen & Föhnen",
    description: "Pflegende Wäsche mit Anti-Frizz-Behandlung und Styling.",
    category: "Styling",
    durationMin: 30,
    priceFrom: 25,
  },
  {
    name: "Farbe komplett",
    description: "Ansatzfärbung und Längenausgleich in Ihrer Wunschfarbe.",
    category: "Färben",
    durationMin: 90,
    priceFrom: 65,
  },
  {
    name: "Ansatzfärbung",
    description: "Auffrischung des nachgewachsenen Ansatzes.",
    category: "Färben",
    durationMin: 60,
    priceFrom: 50,
  },
  {
    name: "Strähnen / Balayage",
    description: "Foliensträhnen oder Balayage-Technik für natürliche Highlights.",
    category: "Färben",
    durationMin: 120,
    priceFrom: 90,
  },
  {
    name: "Tönung",
    description: "Sanfte, auswaschbare Farbauffrischung ohne Ammoniak.",
    category: "Färben",
    durationMin: 45,
    priceFrom: 35,
  },
  {
    name: "Dauerwelle",
    description: "Klassische Dauerwelle für dauerhaften Schwung, inkl. Pflege.",
    category: "Dauerwelle",
    durationMin: 150,
    priceFrom: 85,
  },
  {
    name: "Volumenwelle (Ansatz)",
    description: "Ansatzvolumenwelle für mehr Fülle am Haaransatz.",
    category: "Dauerwelle",
    durationMin: 90,
    priceFrom: 60,
  },
  {
    name: "Glättung / Keratin-Behandlung",
    description: "Intensive Glättungskur für seidig glattes Haar.",
    category: "Behandlung",
    durationMin: 120,
    priceFrom: 100,
  },
  {
    name: "Haarkur / Pflegebehandlung",
    description: "Tiefenpflege je nach Haarzustand mit Kopfhautmassage.",
    category: "Behandlung",
    durationMin: 30,
    priceFrom: 20,
  },
  {
    name: "Hochsteckfrisur / Styling",
    description: "Festliches Styling für besondere Anlässe.",
    category: "Styling",
    durationMin: 60,
    priceFrom: 55,
  },
  {
    name: "Bartschnitt / Bartpflege",
    description: "Konturenschnitt und Pflege für einen gepflegten Bart.",
    category: "Schneiden",
    durationMin: 20,
    priceFrom: 15,
  },
];

async function main() {
  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { name: service.name } });
    if (existing) {
      await prisma.service.update({ where: { id: existing.id }, data: service });
    } else {
      await prisma.service.create({ data: service });
    }
  }
  console.log(`Seeded ${services.length} services.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
