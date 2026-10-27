
import { Suspense } from "react";

import KnowledgeGraph from "@/components/knowledge/KnowledgeGraph";
import { getPublicGraph } from "@/features/knowledge/server/connection-service";

async function GraphContent() {
  const { nodes, edges } = await getPublicGraph();

  if (nodes.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-[#A9A0C1]">
        No public concepts are available yet.
      </div>
    );
  }

  return (
    <KnowledgeGraph
      initialNodes={nodes}
      initialEdges={edges}
    />
  );
}

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-space">
      <header className="border-b border-[#332548] px-6 py-5">
        <p className="text-xs uppercase tracking-[0.25em] text-radiation">
          Knowledge Atlas
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-foreground">
          Explore
        </h1>

        <p className="mt-2 text-sm text-[#A9A0C1]">
          A connected space of concepts, questions and research.
        </p>
      </header>

      <section
        aria-label="Interactive knowledge graph"
        className="w-full"
      >
        <Suspense
          fallback={
            <div className="flex h-[70vh] items-center justify-center text-radiation">
              Loading knowledge graph...
            </div>
          }
        >
          <GraphContent />
        </Suspense>
      </section>
    </main>
  );
}
