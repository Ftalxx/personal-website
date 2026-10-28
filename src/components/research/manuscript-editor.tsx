"use client";

import { useState } from "react";
import katex from "katex";
import { parseManuscript } from "@/features/knowledge/manuscript/parser";

type Section = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  title?: string;
  author?: string;
  date: string;
};

const sample = String.raw`{abstract}
An exploration of quantum mechanics and its mathematical foundations.

{introduction}
Quantum mechanics describes the behavior of matter and energy at microscopic scales.

{pathways}
Quantum systems can occupy discrete energy levels.

The time-independent Schrödinger equation is:

$$
\hat{H}\psi = E\psi
$$`;

const normalize = (value: string) => value.trim().toLowerCase();
const markerRegex = /(?:^|\s)\{([A-Za-z][A-Za-z0-9 _-]*)\}/;

function getTopic(value: string) {
  return value.match(markerRegex)?.[1]?.trim() ?? "";
}

function MathText({ text }: { text: string }) {
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g);

  return (
    <div className="whitespace-pre-line leading-relaxed">
      {parts.map((part, index) => {
        const display = part.startsWith("$$") && part.endsWith("$$");
        const inline = !display && part.startsWith("$") && part.endsWith("$");

        if (!display && !inline) return <span key={index}>{part}</span>;

        const expression = display
          ? part.slice(2, -2).trim()
          : part.slice(1, -1);

        const html = katex.renderToString(expression, {
          displayMode: display,
          throwOnError: false,
          trust: false,
          output: "htmlAndMathml",
        });

        return (
          <span
            key={index}
            className={display ? "my-5 block overflow-x-auto text-center" : ""}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </div>
  );
}

export default function ManuscriptEditor({
  title = "Quantum Mechanics",
  author = "Veronica Segovia",
  date,
}: Props) {
  const [sections, setSections] = useState<Section[]>(() =>
    parseManuscript(sample).sections.map((section) => ({
      id: section.id,
      title: section.title,
      content: section.paragraphs.join("\n\n"),
    }))
  );
  const [editorOpen, setEditorOpen] = useState(false);
  const [entry, setEntry] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const topic = getTopic(entry);
  const existing = sections.find((section) => normalize(section.title) === normalize(topic));
  const editing = editingId !== null;
  const abstract = sections.find((section) => normalize(section.title) === "abstract");
  const body = sections.filter((section) => normalize(section.title) !== "abstract");

  function handleEntry(value: string) {
    setEntry(value);
    setMessage("");
    if (editing) {
      const selected = sections.find((section) => section.id === editingId);
      if (normalize(getTopic(value)) !== normalize(selected?.title ?? "")) {
        setEditingId(null);
      }
    }
  }

  function loadExisting() {
    if (!existing) return;
    setEntry(`{${existing.title}}\n${existing.content}`);
    setEditingId(existing.id);
    setMessage("");
  }

  function save() {
    if (!markerRegex.test(entry)) {
      setMessage("Include a {topic} marker somewhere in your text.");
      return;
    }

    const parsed = parseManuscript(entry);

    if (editing) {
      const target = sections.find((section) => section.id === editingId);
      if (
        !target ||
        parsed.sections.length !== 1 ||
        normalize(parsed.sections[0].title) !== normalize(target.title)
      ) {
        setMessage("Alter one existing section at a time.");
        return;
      }

      const content = parsed.sections[0].paragraphs.join("\n\n");
      setSections((previous) =>
        previous.map((section) =>
          section.id === editingId ? { ...section, content } : section
        )
      );
    } else {
      const additions = parsed.sections.filter((section) => section.paragraphs.length > 0);
      if (!additions.length) {
        setMessage("Write content after a {topic} marker.");
        return;
      }

      setSections((previous) => {
        const next = previous.map((section) => ({ ...section }));
        for (const addition of additions) {
          const found = next.find(
            (section) => normalize(section.title) === normalize(addition.title)
          );
          const content = addition.paragraphs.join("\n\n").trim();
          if (found) {
            // One empty line, no extra CSS margin between entries.
            found.content = [found.content.trimEnd(), content]
              .filter(Boolean)
              .join("\n\n");
          } else {
            next.push({
              id: crypto.randomUUID(),
              title: addition.title,
              content,
            });
          }
        }
        return next;
      });
    }

    setEntry("");
    setEditingId(null);
    setMessage("Manuscript updated.");
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <section className="min-w-0 rounded-xl border p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Notes</h2>
          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            aria-label="Open manuscript editor"
            className="rounded-lg border px-3 py-1 text-xl"
          >
            +
          </button>
        </div>

        <article
          className="mx-auto min-h-150 bg-white px-6 py-12 text-[#171717] shadow-sm sm:px-10"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: "16px",
            lineHeight: 1.55,
          }}
        >
          <header className="mb-12 text-center">
            <h1 className="text-[24px] font-normal">{title}</h1>
            <p className="mt-4 text-[15px]">{author}</p>
            <p className="mt-2 text-[14px]">{date}</p>
          </header>

          {abstract && (
            <section className="mb-10">
              <h2 className="mb-3 text-center text-sm font-bold">Abstract</h2>
              <div className="text-justify text-sm">
                <MathText text={abstract.content} />
              </div>
            </section>
          )}

          <div className="space-y-8">
            {body.map((section, index) => (
              <section key={section.id}>
                <h2 className="mb-3 text-[17px] font-bold">
                  {index + 1} {section.title.charAt(0).toUpperCase() + section.title.slice(1)}
                </h2>
                {/* Render as one text block. \n\n controls paragraph spacing. */}
                <div className="text-justify">
                  <MathText text={section.content} />
                </div>
              </section>
            ))}
          </div>
        </article>
      </section>

      {editorOpen && (
        <section className="min-w-0 rounded-xl border p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">{editing ? "Alter manuscript" : "Add to topic"}</h2>
            <button
              type="button"
              aria-label="Close editor"
              onClick={() => setEditorOpen(false)}
              className="rounded-lg border px-3 py-1"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
            {sections
              .filter((section) => normalize(section.title) !== "abstract")
              .map((section, index) => (
                <span key={section.id}>
                  {index > 0 && <span className="mr-2 text-neutral-500">|</span>}
                  {section.title.charAt(0).toUpperCase() + section.title.slice(1)}
                </span>
              ))}
          </div>

          <textarea
            value={entry}
            onChange={(event) => handleEntry(event.target.value)}
            placeholder={"{energy}\nWrite your research thought here..."}
            className="min-h-112.5 w-full resize-y rounded-lg border bg-transparent p-4 font-mono text-sm leading-7 outline-none"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-neutral-800 px-5 py-2 text-sm text-white"
            >
              {editing ? "Alter manuscript" : "Add to manuscript"}
            </button>

            {existing && !editing && (
              <button
                type="button"
                onClick={loadExisting}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Alter existing
              </button>
            )}

            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setEntry("");
                  setMessage("");
                }}
                className="text-sm text-neutral-500"
              >
                Cancel alteration
              </button>
            )}
          </div>

          {message && (
            <p role="status" className="mt-3 text-sm text-neutral-500">
              {message}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
