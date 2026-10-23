
import { NextResponse } from "next/server";

import {
  getPublicConcepts,
  getConceptWithConnections,
} from "@/features/knowledge/server/concept-service";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  try {
    const concepts = await getPublicConcepts();
    const sun = await getConceptWithConnections("sun");

    return NextResponse.json({
      success: true,
      conceptCount: concepts.length,
      concepts,
      sun,
    });
  } catch (error) {
    console.error("Concept query failed:", error);

    return NextResponse.json(
      { success: false, error: "Database query failed" },
      { status: 500 }
    );
  }
}
