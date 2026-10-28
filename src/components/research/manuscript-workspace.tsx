
"use client";

import { useState } from "react";
import katex from "katex";
import { parseManuscript } from
  "@/features/knowledge/manuscript/parser";

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

const normalize = (s: string) => s.trim().toLowerCase();

const marker = /(?:^|\s)\{([A-Za-z][A-Za-z0-9 _-]*)\}/;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "America/New_York",
});

const dayFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "America/New_York",
});

function MathText({ content }: { content: string }) {
  const parts = content.split(
    /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g
  );

  return (
    <div className="whitespace-pre-line leading-relaxed">
      {parts.map((part, i) => {
        const display =
          part.startsWith("$$") && part.endsWith("$$");

        const inline =
          !display &&
          part.startsWith("$") && part.endsWith("$");

        if (!display && !inline) {
          return <span key={i}>{part}</span>;
        }

        const latex = display
          ? part.slice(2, -2).trim()
          : part.slice(1, -1);

        return (
          <span
            key={i}
            className={
              display
                ? "my-5 block overflow-x-auto text-center"
                : ""
            }
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(latex, {
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

export default function ManuscriptWorkspace({
  title,
  author,
  createdAt,
  passages,
}: Props) {
  const [items, setItems] = useState(passages);
  const [editorOpen, setEditorOpen] = useState(false);
  const [entry, setEntry] = useState("");
  const [editingId, setEditingId] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState("");

  const topic = entry.match(marker)?.[1]?.trim() ?? "";

  const groups = new Map<string, Passage[]>();

  for (const passage of items) {
    const key = normalize(passage.sectionKey);
    const group = groups.get(key) ?? [];
    group.push(passage);
    groups.set(key, group);
  }

  const abstract = groups.get("abstract") ?? [];
  groups.delete("abstract");

  const existing = items.find(
    (p) => normalize(p.sectionKey) === normalize(topic)
  );

  const editing = editingId !== null;

  const latest = items.reduce(
    (date, p) => p.updatedAt > date ? p.updatedAt : date,
    createdAt
  );

  function loadExisting() {
    if (!existing) return;

    const related = items.filter(
      (p) =>
        normalize(p.sectionKey) ===
        normalize(existing.sectionKey)
    );

    setEntry(
      `{${existing.sectionTitle}}\n` +
      related.map((p) => p.content).join("\n\n")
    );

    setEditingId(existing.sectionKey);
    setMessage("");
  }

  function saveLocal() {
    if (!marker.test(entry)) {
      setMessage("Include a {topic} marker.");
      return;
    }

    const parsed = parseManuscript(entry);
    const additions = parsed.sections.filter(
      (s) => s.paragraphs.length > 0
    );

    if (!additions.length) {
      setMessage("Add some research text.");
      return;
    }

    if (editing) {
      if (
        additions.length !== 1 ||
        normalize(additions[0].title) !==
          normalize(editingId ?? "")
      ) {
        setMessage("Alter one existing topic at a time.");
        return;
      }

      const updated = additions[0];

      setItems((previous) => {
        const matching = previous.filter(
          (p) =>
            normalize(p.sectionKey) ===
            normalize(editingId ?? "")
        );

        if (!matching.length) return previous;

        const firstId = matching[0].id;
        const now = new Date().toISOString();

        return previous
          .filter(
            (p) =>
              normalize(p.sectionKey) !==
                normalize(editingId ?? "") ||
              p.id === firstId
          )
          .map((p) =>
            p.id === firstId
              ? {
                  ...p,
                  content: updated.paragraphs.join("\n\n"),
                  updatedAt: now,
                }
              : p
          );
      });
    } else {
      const now = new Date().toISOString();

      setItems((previous) => [
        ...previous,
        ...additions.map((section) => ({
          id: crypto.randomUUID(),
          sectionKey: normalize(section.title),
          sectionTitle: section.title,
          content: section.paragraphs.join("\n\n"),
          writtenAt: now,
          updatedAt: now,
        })),
      ]);
    }

    setEntry("");
    setEditingId(null);
    setMessage("Preview updated. Not saved to database.");
  }

  function renderPassages(list: Passage[]) {
    // Consecutive submissions on the same day share a marker.
    const blocks: Passage[][] = [];

    for (const passage of list) {
      const last = blocks[blocks.length - 1];
      const day = dayFormat.format(
        new Date(passage.writtenAt)
      );

      if (
        last &&
        dayFormat.format(new Date(last[0].writtenAt)) === day
      ) {
        last.push(passage);
      } else {
        blocks.push([passage]);
      }
    }

    return blocks.map((block) => {
      const originalDate = dateFormat.format(
        new Date(block[0].writtenAt)
      );

      const modified = block.reduce(
        (latest, p) =>
          p.updatedAt > latest ? p.updatedAt : latest,
        block[0].updatedAt
      );

      return (
        <div
          key={block[0].id}
          className="relative mb-4 pl-4"
        >
          <span
            tabIndex={0}
            title={
              `Written: ${originalDate}\n` +
              `Last edited: ${dateFormat.format(new Date(modified))}`
            }
            aria-label={`Written ${originalDate}`}
            className="absolute left-0 top-0 cursor-help text-neutral-400"
          >
            *
          </span>

          <div className="space-y-3 text-justify">
            {block.map((p) => (
              <MathText key={p.id} content={p.content} />
            ))}
          </div>
        </div>
      );
    });
  }

  return (
    <div className="grid items-start gap-6 p-4 lg:grid-cols-2 lg:p-8">
      {/* LEFT: Always-visible manuscript */}
      <section className="min-w-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Notes
          </h2>

          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            aria-label="Open manuscript editor"
            className="rounded-lg border border-[#49365E] px-3 py-1 text-xl text-radiation hover:bg-[#251B37]"
          >
            +
          </button>
        </div>

        <article
          className="min-h-175 bg-[#FEFEFD] px-7 py-12 text-[#161616] shadow-lg sm:px-12"
          style={{
            fontFamily:
              'Georgia, "Times New Roman", serif',
            fontSize: "16px",
            lineHeight: 1.55,
          }}
        >
          <header className="mb-12 text-center">
            <h1 className="text-[26px] font-normal">
              {title}
            </h1>
            <p className="mt-4 text-[15px]">{author}</p>
            <p className="mt-2 text-[14px]">
              {dateFormat.format(new Date(latest))}
            </p>
          </header>

          {abstract.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-3 text-center font-bold">
                Abstract
              </h2>
              {renderPassages(abstract)}
            </section>
          )}

          <div className="space-y-8">
            {Array.from(groups.entries()).map(
              ([key, group], index) => (
                <section key={key}>
                  <h2 className="mb-4 text-[18px] font-bold">
                    {index + 1}{" "}
                    {group[0].sectionTitle
                      .charAt(0).toUpperCase() +
                      group[0].sectionTitle.slice(1)}
                  </h2>

                  {renderPassages(group)}
                </section>
              )
            )}
          </div>

          {items.length === 0 && (
            <p className="text-center text-sm italic text-neutral-500">
              No published research notes yet.
            </p>
          )}
        </article>
      </section>

      {/* RIGHT: Editor opens when + is pressed */}
      {editorOpen && (
        <section className="min-w-0 rounded-xl border border-[#49365E] bg-[#171124] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">
              {editing ? "Alter manuscript" : "Add to topic"}
            </h2>

            <button
              type="button"
              aria-label="Close editor"
              onClick={() => setEditorOpen(false)}
              className="rounded-lg border border-[#49365E] px-3 py-1"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-x-2 text-xs text-[#A9A0C1]">
            {Array.from(groups.values()).map((group, i) => (
              <span key={group[0].sectionKey}>
                {i > 0 && <span className="mr-2">|</span>}
                {group[0].sectionTitle}
              </span>
            ))}
          </div>

          <textarea
            value={entry}
            onChange={(e) => {
              setEntry(e.target.value);
              setMessage("");

              if (
                editingId &&
                normalize(e.target.value.match(marker)?.[1] ?? "")
                  !== normalize(editingId)
              ) {
                setEditingId(null);
              }
            }}
            placeholder={
              "{introduction} Write your research here..."
            }
            className="min-h-105 w-full resize-y rounded-lg border border-[#49365E] bg-[#100B1B] p-4 font-mono text-sm leading-7 text-foreground outline-none focus:border-radiation"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveLocal}
              className="rounded-lg bg-[#7655AA] px-5 py-2 text-sm text-white hover:bg-[#8667B9]"
            >
              {editing
                ? "Alter manuscript"
                : "Add to manuscript"}
            </button>

            {existing && !editing && (
              <button
                type="button"
                onClick={loadExisting}
                className="rounded-lg border border-[#49365E] px-4 py-2 text-sm"
              >
                Alter existing
              </button>
            )}
          </div>

          <p className="mt-4 text-xs text-[#A9A0C1]">
            Local preview only. Changes will not survive a refresh.
          </p>

          {message && (
            <p role="status" className="mt-2 text-xs text-radiation">
              {message}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
