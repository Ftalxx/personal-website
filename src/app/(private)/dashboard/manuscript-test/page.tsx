
import { Suspense } from "react";
import { connection } from "next/server";

import ManuscriptEditor from
  "@/components/research/manuscript-editor";

async function ManuscriptTestContent() {
  // Runtime-only data access stays inside Suspense.
  await connection();

  const date = new Date().toISOString();

  return (
    <ManuscriptEditor
      title="Quantum Mechanics"
      author="Veronica Segovia"
      date={date}
    />
  );
}

export default function ManuscriptTestPage() {
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8">
      <Suspense
        fallback={
          <div className="text-sm text-neutral-500">
            Loading manuscript editor...
          </div>
        }
      >
        <ManuscriptTestContent />
      </Suspense>
    </main>
  );
}
