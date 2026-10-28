
import { strict as assert } from "node:assert";
import { parseManuscript } from
  "./src/features/knowledge/manuscript/parser";
import { manuscriptToLatex } from
  "./src/features/knowledge/manuscript/latex";

const source = `
{introduction}
Quantum mechanics describes microscopic systems.

{pathways}
Energy can be quantized.

{introduction}
The state of a system is represented by a vector.

{derivations}
The time-independent Schrodinger equation is:

$$
\\hat{H}\\psi = E\\psi
$$
`;

const manuscript = parseManuscript(source);

assert.equal(manuscript.sections.length, 3);
assert.equal(manuscript.sections[0].title, "introduction");
assert.equal(manuscript.sections[0].paragraphs.length, 2);
assert.equal(manuscript.sections[1].title, "pathways");
assert.equal(manuscript.sections[2].title, "derivations");

const latex = manuscriptToLatex(source, {
  title: "Quantum Mechanics",
  author: "Veronica Segovia",
  date: "October 28, 2026",
});

assert.ok(latex.includes("\\section{introduction}"));
assert.ok(latex.includes("\\hat{H}\\psi = E\\psi"));

console.log("All manuscript tests passed!");
console.log(latex);
