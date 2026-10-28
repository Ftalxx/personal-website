
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getPrisma } from "@/lib/db/prisma";
import ManuscriptWorkspace from
  "@/components/research/manuscript-workspace";

type Props = {
  params: Promise<{ slug: string }>;
};

async function ConceptContent({ params }: Props) {
  await connection();

  const { slug } = await params;
  const prisma = getPrisma();

  const concept = await prisma.concept.findFirst({
    where: {
      slug,
      visibility: "PUBLIC",
    },
    include: {
      passages: {
        where: {
          visibility: "PUBLIC",
        },
        orderBy: [
          { order: "asc" },
          { createdAt: "asc" },
        ],
      },
    },
  });

  if (!concept) {
    notFound();
  }

  return (
    <ManuscriptWorkspace
      title={concept.title}
      author="Veronica Segovia"
      createdAt={concept.createdAt.toISOString()}
      passages={concept.passages.map((p) => ({
        id: p.id,
        sectionKey: p.sectionKey,
        sectionTitle: p.sectionTitle,
        content: p.content,
        writtenAt: p.writtenAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }))}
    />
  );
}

export default function ConceptNotesPage(props: Props) {
  return (
    <main className="min-h-screen bg-space text-foreground">

      <Suspense
        fallback={
          <div className="p-10 text-sm text-[#A9A0C1]">
            Loading research manuscript...
          </div>
        }
      >
        <ConceptContent {...props} />
      </Suspense>
    </main>
  );
}
