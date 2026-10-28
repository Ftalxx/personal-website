
"use client";

import katex from "katex";

type Passage = {
  id: string;
  sectionKey: string;
  sectionTitle: string;
  content: string;
  writtenAt: string;
  updatedAt: string;
};

type Props = {
  title: string;
  author: string;
  createdAt: string;
  passages: Passage[];
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function MathContent({ text }: { text: string }) {
  const parts = text.split(
    /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g
  );

  return (
    <div className="whitespace-pre-line leading-relaxed">
      {parts.map((part, index) => {
        const display =
          part.startsWith("$$") && part.endsWith("$$");
        const inline =
          !display &&
          part.startsWith("$") && part.endsWith("$");

        if (!display && !inline) {
          return <span key={index}>{part}</span>;
        }

        const expression = display
          ? part.slice(2, -2).trim()
          : part.slice(1, -1);

        return (
          <span
            key={index}
            className={
              display
                ? "my-5 block overflow-x-auto text-center"
                : ""
            }
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(expression, {
                displayMode: display,
                throwOnError: false,
                trust: false,
                output: "htmlAndMathml",
              }),
            }}
          />
        );
      })}
    </div>
  );
}

export default function ManuscriptReader({
  title,
  author,
  createdAt,
  passages,
}: Props) {
  // Sections follow their first appearance.
  const sections = new Map<string, Passage[]>();

  for (const passage of passages) {
    const key = passage.sectionKey.toLowerCase();
    const group = sections.get(key) ?? [];
    group.push(passage);
    sections.set(key, group);
  }

  const abstract = sections.get("abstract");
  sections.delete("abstract");

  const latestDate = passages.reduce(
    (latest, passage) =>
      passage.updatedAt > latest
        ? passage.updatedAt
        : latest,
    createdAt
  );

  function renderPassages(items: Passage[]) {
    // Group submissions from the same section and day.
    const days = new Map<string, Passage[]>();

    for (const passage of items) {
      const day = dayFormatter.format(
        new Date(passage.writtenAt)
      );

      const group = days.get(day) ?? [];
      group.push(passage);
      days.set(day, group);
    }

    return Array.from(days.entries()).map(([day, group]) => {
      const modified = group.reduce(
        (latest, p) =>
          p.updatedAt > latest ? p.updatedAt : latest,
        group[0].updatedAt
      );

      return (
        <div key={day} className="relative mb-5 pl-5">
          <button
            type="button"
            title={
              `Written: ${dateFormatter.format(
                new Date(group[0].writtenAt)
              )}\nLast modified: ${dateFormatter.format(
                new Date(modified)
              )}`
            }
            aria-label={`Research written on ${day}`}
            className="absolute left-0 top-0 text-sm text-neutral-400 hover:text-neutral-800"
          >
            *
          </button>

          <div className="space-y-3 text-justify">
            {group.map((passage) => (
              <MathContent
                key={passage.id}
                text={passage.content}
              />
            ))}
          </div>
        </div>
      );
    });
  }

  return (
    <section className="w-full max-w-205">
      <article
        className="min-h-212.5 bg-white px-8 py-14 text-[#171717] shadow-sm sm:px-12"
        style={{
          fontFamily:
            'Georgia, "Times New Roman", serif',
          fontSize: "16px",
          lineHeight: 1.55,
        }}
      >
        <header className="mb-12 text-center">
          <h1 className="text-[25px] font-normal">
            {title}
          </h1>

          <p className="mt-4 text-[15px]">{author}</p>

          <p className="mt-2 text-[14px]">
            {dateFormatter.format(new Date(latestDate))}
          </p>
        </header>

        {abstract && (
          <section className="mb-10">
            <h2 className="mb-3 text-center font-bold">
              Abstract
            </h2>
            {renderPassages(abstract)}
          </section>
        )}

        <div className="space-y-8">
          {Array.from(sections.entries()).map(
            ([key, items], index) => (
              <section key={key}>
                <h2 className="mb-4 text-[18px] font-bold">
                  {index + 1}{" "}
                  {items[0].sectionTitle}
                </h2>

                {renderPassages(items)}
              </section>
            )
          )}
        </div>
      </article>
    </section>
  );
}
