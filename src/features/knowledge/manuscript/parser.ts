
export type ManuscriptSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type Manuscript = {
  sections: ManuscriptSection[];
};

function sectionId(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}

const markerPattern =
  /(^|\s)\{([A-Za-z][A-Za-z0-9 _-]*)\}/g;

export function parseManuscript(source: string): Manuscript {
  const sections: ManuscriptSection[] = [];
  const lookup = new Map<string, ManuscriptSection>();

  let current: ManuscriptSection | null = null;
  let buffer = "";

  function getSection(title: string): ManuscriptSection {
    const key = title.trim().toLowerCase();

    let section = lookup.get(key);

    if (!section) {
      section = {
        id: sectionId(key),
        title: title.trim(),
        paragraphs: [],
      };

      lookup.set(key, section);
      sections.push(section);
    }

    return section;
  }

  function flush() {
    const text = buffer.trim();

    if (text) {
      current ??= getSection("Introduction");
      current.paragraphs.push(text);
    }

    buffer = "";
  }

  function append(value: string) {
    buffer += value;
  }

  const lines = source
    .replace(/\r\n?/g, "\n")
    .split("\n");

  let inDisplayMath = false;

  for (const line of lines) {
    // Preserve all content inside $$ ... $$.
    if (inDisplayMath) {
      append(line + "\n");

      if ((line.match(/\$\$/g) ?? []).length % 2 === 1) {
        inDisplayMath = false;
      }

      continue;
    }

    // Shortcut for display equations.
    const equation = line.match(
      /^\s*\{eq\}\s*(.+)$/i
    );

    if (equation) {
      flush();
      append(`$$\n${equation[1].trim()}\n$$`);
      flush();
      continue;
    }

    markerPattern.lastIndex = 0;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = markerPattern.exec(line)) !== null) {
      const before = line.slice(lastIndex, match.index);
      const title = match[2].trim();

      // {eq} is reserved for equations.
      if (title.toLowerCase() === "eq") {
        continue;
      }

      const target = getSection(title);

      if (current && current !== target) {
        // A different section starts here.
        if (before.trim()) {
          append(before);
        }

        flush();
        current = target;
      } else {
        // Same section or first section.
        // Keep the words around the marker together.
        current = target;

        if (before.trim()) {
          append(before);
        }
      }

      // Replace {topic} with a single space when
      // it appears between words.
      if (buffer.trim()) {
        append(" ");
      }

      lastIndex = markerPattern.lastIndex;
    }

    append(line.slice(lastIndex) + "\n");

    // Blank lines create paragraph boundaries.
    if (!line.trim()) {
      flush();
    }

    // Track multiline display mathematics.
    const mathDelimiters =
      (line.match(/\$\$/g) ?? []).length;

    if (mathDelimiters % 2 === 1) {
      inDisplayMath = true;
    }
  }

  flush();

  return { sections };
}
