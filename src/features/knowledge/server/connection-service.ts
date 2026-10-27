import "server-only";

import { getPrisma } from "@/lib/db/prisma";
import { Visibility } from "@/generated/prisma/client";
import type { Node, Edge } from "@xyflow/react";

export type ConceptNode = Node<{
  label: string;
  slug: string;
  difficulty: number;
  },
"semantic"
>;

export type ConceptEdge = Edge;

import type { RelationType } from "@/generated/prisma/client";

function getRelationshipColor(
  type: RelationType,
  isSuggested: boolean
): string {
  if (isSuggested) {
    return "#7B2CBF";
  }

  switch (type) {
    case "OPPOSITE_OF":
      return "#501717";

    case "EXAMPLE_OF":
      return "#173f7e";

    case "RELATED_TO":
    case "LEADS_TO":
    case "PROJECTION_OF":
    default:
      return "#3A86FF";
  }
}

export async function getPublicGraph(): Promise<{
  nodes: ConceptNode[];
  edges: ConceptEdge[];
}> {
  const prisma = getPrisma();

  const [concepts, connections] = await Promise.all([
    prisma.concept.findMany({
      where: {
        visibility: Visibility.PUBLIC,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        difficulty: true,
        x: true,
        y: true,
      },
    }),

    prisma.conceptConnection.findMany({
      where: {
        fromConcept: {
          visibility: Visibility.PUBLIC,
        },
        toConcept: {
          visibility: Visibility.PUBLIC,
        },
      },
      select: {
        id: true,
        fromConceptId: true,
        toConceptId: true,
        type: true,
        directional: true,
        isSuggested: true,
      },
    }),
  ]);

  
const nodes: ConceptNode[] = concepts.map((concept) => ({
  id: concept.id,
  type: "semantic",
  position: {
    x: concept.x,
    y: concept.y,
  },
  data: {
    label: concept.title,
    slug: concept.slug,
    difficulty: concept.difficulty,
  },
}));



const edges: ConceptEdge[] = connections.map((connection) => {
  const color = getRelationshipColor(
    connection.type,
    connection.isSuggested
  );

  return {
    id: connection.id,
    source: connection.fromConceptId,
    target: connection.toConceptId,

    // Straight lines instead of right-angle connections
    type: "straight",
    animated: false,

    style: {
      stroke: color,
      strokeWidth: connection.isSuggested ? 1.5 : 2.5,
      strokeDasharray: connection.isSuggested ? "5 5" : undefined,
    },
  };
});

  return { nodes, edges };
}
