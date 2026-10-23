
import "server-only";

import { getPrisma } from "@/lib/db/prisma";
import { Visibility } from "@/generated/prisma/client";

// Find a public concept by slug.
export async function getConceptBySlug(slug: string) {
  const prisma = getPrisma();
  return prisma.concept.findFirst({
    where: {
      slug,
      visibility: Visibility.PUBLIC,
    },
  });
}

// Get all public concepts.
export async function getPublicConcepts() {
  const prisma = getPrisma();
  return prisma.concept.findMany({
    where: {
      visibility: Visibility.PUBLIC,
    },
    orderBy: {
      title: "asc",
    },
  });
}

// Get a concept with its publicly accessible connections.
export async function getConceptWithConnections(slug: string) {
  const prisma = getPrisma();
  const concept = await getConceptBySlug(slug);

  if (!concept) {
    return null;
  }

  const connections = await prisma.conceptConnection.findMany({
    where: {
      OR: [
        { fromConceptId: concept.id },
        { toConceptId: concept.id },
      ],
      fromConcept: {
        visibility: Visibility.PUBLIC,
      },
      toConcept: {
        visibility: Visibility.PUBLIC,
      },
    },
    include: {
      fromConcept: true,
      toConcept: true,
    },
  });

  return {
    concept,
    connections,
  };
}
