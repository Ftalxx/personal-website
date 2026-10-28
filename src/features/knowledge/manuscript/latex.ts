
import {
  parseManuscript,
  type Manuscript,
} from "./parser";

export type ManuscriptMetadata = {
  title: string;
  author: string;
  date: string;
};

function escapeLatex(text: string): string {
  const replacements: Record<string, string> = {
    "\\": "\\textbackslash{}",
    "&": "\\&",
    "%": "\\%",
    "$": "\\$",
    "#": "\\#",
    "_": "\\_",
    "{": "\\{",
    "}": "\\}",
    "~": "\\textasciitilde{}",
    "^": "\\textasciicircum{}",
  };

  return text.replace(
    /[\\&%$#_{}~^]/g,
    (char) => replacements[char]
  );
}

function formatParagraph(text: string): string {
  // Preserve explicitly delimited LaTeX math.
  // Ordinary prose is escaped to keep the document valid.
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g);

  return parts
    .map((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        return "\\[\n" + part.slice(2, -2).trim() + "\n\\]";
      }

      if (part.startsWith("$") && part.endsWith("$")) {
        return part;
      }

      return escapeLatex(part);
    })
    .join("");
}

export function generateLatex(
  manuscript: Manuscript,
  metadata: ManuscriptMetadata
): string {
  const sections = manuscript.sections.map((section) => {
    const content = section.paragraphs
      .map(formatParagraph)
      .join("\n\n");

    return `\\section{${escapeLatex(section.title)}}\n\n${content}`;
  });

  return [
    "\\documentclass[12pt,letterpaper]{article}",
    "\\usepackage[T1]{fontenc}",
    "\\usepackage{lmodern}",
    "\\usepackage{amsmath,amssymb}",
    "\\usepackage[margin=1in]{geometry}",
    "\\usepackage{hyperref}",
    "",
    `\\title{${escapeLatex(metadata.title)}}`,
    `\\author{${escapeLatex(metadata.author)}}`,
    `\\date{${escapeLatex(metadata.date)}}`,
    "",
    "\\begin{document}",
    "\\maketitle",
    "\\tableofcontents",
    "\\newpage",
    "",
    ...sections,
    "",
    "\\end{document}",
    "",
  ].join("\n\n");
}

export function manuscriptToLatex(
  source: string,
  metadata: ManuscriptMetadata
): string {
  return generateLatex(parseManuscript(source), metadata);
}
