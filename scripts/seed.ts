
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const concepts = [
    {
      slug: "sun",
      title: "Sun",
      description: "The star at the center of our solar system.",
      difficulty: 1,
      x: 0,
      y: 0,
    },
    {
      slug: "energy",
      title: "Energy",
      description: "A conserved quantity associated with the state and transformations of physical systems.",
      difficulty: 2,
      x: 280,
      y: -130,
    },
    {
      slug: "darkness",
      title: "Darkness",
      description: "The absence or reduction of visible light.",
      difficulty: 1,
      x: -260,
      y: 160,
    },
    {
      slug: "moon",
      title: "Moon",
      description: "Earth's natural satellite, visible partly through reflected sunlight.",
      difficulty: 1,
      x: 120,
      y: 230,
    },
    {
      slug: "star",
      title: "Star",
      description: "A luminous astronomical object sustained for much of its life by nuclear fusion.",
      difficulty: 2,
      x: 350,
      y: 190,
    },
  ] as const;

  const ids: Record<string, string> = {};

  for (const concept of concepts) {
    const saved = await prisma.concept.upsert({
      where: { slug: concept.slug },
      update: {
        title: concept.title,
        description: concept.description,
        difficulty: concept.difficulty,
        x: concept.x,
        y: concept.y,
      },
      create: {
        ...concept,
        visibility: "PUBLIC",
        publishedAt: new Date(),
      },
    });

    ids[concept.slug] = saved.id;
    console.log(`Saved concept: ${saved.title}`);
  }

  const connections = [
    ["sun", "energy", "RELATED_TO", 0.95, false],
    ["sun", "darkness", "OPPOSITE_OF", 0.9, false],
    ["darkness", "moon", "RELATED_TO", 0.75, false],
    ["sun", "moon", "RELATED_TO", 0.85, false],
    ["sun", "star", "EXAMPLE_OF", 1.0, false],
    ["moon", "star", "SUGGESTS", 0.4, true],
  ] as const;

  for (const [from, to, type, strength, isSuggested] of connections) {
    const data = {
      fromConceptId: ids[from],
      toConceptId: ids[to],
      type,
      strength,
      directional: true,
      isSuggested,
    };

    await prisma.conceptConnection.upsert({
      where: {
        fromConceptId_toConceptId_type: {
          fromConceptId: data.fromConceptId,
          toConceptId: data.toConceptId,
          type: data.type,
        },
      },
      update: {
        strength: data.strength,
        directional: data.directional,
        isSuggested: data.isSuggested,
      },
      create: data,
    });

    console.log(`Connected: ${from} -> ${to}`);
  }

  const graph = await prisma.concept.findMany({
    where: { visibility: "PUBLIC" },
    include: {
      outgoing: {
        include: { toConcept: true },
      },
    },
  });

  console.log("\nGraph summary:");

  for (const concept of graph) {
    console.log(
      `${concept.title}: ${concept.outgoing.length} outgoing connections`
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
