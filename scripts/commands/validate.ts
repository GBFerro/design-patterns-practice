import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { allExercises, repoRoot, solutionDirs, type Exercise } from "../lib/exercises.ts";
import { bold, CROSS, dim, line, TICK } from "../lib/ui.ts";

interface Problem {
  readonly where: string;
  readonly what: string;
}

function canonicalPatternNames(): Set<string> {
  const file = join(repoRoot(), "docs", "pattern-names.json");
  const data = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
  const names = new Set<string>();
  for (const key of ["creational", "structural", "behavioral"]) {
    for (const name of (data[key] as string[] | undefined) ?? []) names.add(name);
  }
  return names;
}

const REQUIRED_FILES = [
  "meta.json",
  "package.json",
  "README.en.md",
  "src/index.ts",
  "act2/README.en.md",
];

function fileTree(dir: string, prefix = ""): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) out.push(...fileTree(join(dir, entry.name), rel));
    else out.push(rel);
  }
  return out.sort();
}

function sameBytes(a: string, b: string): boolean {
  const filesA = fileTree(a).filter((file) => file.endsWith(".ts"));
  const filesB = fileTree(b).filter((file) => file.endsWith(".ts"));
  if (filesA.length !== filesB.length || filesA.length === 0) return false;
  if (filesA.join() !== filesB.join()) return false;
  return filesA.every(
    (file) => readFileSync(join(a, file), "utf8") === readFileSync(join(b, file), "utf8"),
  );
}

function markdownLinks(file: string): string[] {
  const text = readFileSync(file, "utf8");
  return [...text.matchAll(/]\((\.[^)\s#]+)/g)].map((match) => match[1]!);
}

function checkExercise(
  exercise: Exercise,
  names: Set<string>,
  problems: Problem[],
): void {
  const { meta, dir } = exercise;
  const where = meta.id;

  for (const required of REQUIRED_FILES) {
    if (!existsSync(join(dir, required)))
      problems.push({ where, what: `falta ${required}` });
  }
  if (
    !existsSync(join(dir, "act2", "tests")) ||
    fileTree(join(dir, "act2", "tests")).length === 0
  ) {
    problems.push({ where, what: "act2/tests/ está vazio ou não existe" });
  }
  if (meta.providesTests && fileTree(join(dir, "tests")).length === 0) {
    problems.push({ where, what: "providesTests é true mas tests/ está vazio" });
  }

  for (const pattern of meta.patterns) {
    if (!names.has(pattern)) {
      problems.push({ where, what: `"${pattern}" não está em docs/pattern-names.json` });
    }
  }

  if (meta.type === "drill" && meta.solutions.length !== 1) {
    problems.push({
      where,
      what: `drill deve ter 1 solução, tem ${meta.solutions.length}`,
    });
  }
  if (meta.type === "choice") {
    if (meta.solutions.length < 2) {
      problems.push({ where, what: "choice precisa de 2 ou mais soluções" });
    }
    const absorbing = meta.solutions.filter((solution) => solution.absorbsAct2 === true);
    if (absorbing.length !== 1) {
      problems.push({
        where,
        what: `choice precisa de exatamente 1 solução com absorbsAct2, tem ${absorbing.length}`,
      });
    }
  }

  for (const solution of meta.solutions) {
    const solutionDir = join(dir, "solutions", solution.slug);
    if (!existsSync(solutionDir)) {
      problems.push({
        where,
        what: `meta declara solutions/${solution.slug}/ e ela não existe`,
      });
      continue;
    }
    for (const required of ["index.ts", "STEPS.md", "WALKTHROUGH.md", "ACT2.md"]) {
      if (!existsSync(join(solutionDir, required))) {
        problems.push({ where, what: `falta solutions/${solution.slug}/${required}` });
      }
    }
    if (sameBytes(join(dir, "src"), solutionDir)) {
      problems.push({
        where,
        what: `src/ é byte-idêntico a solutions/${solution.slug}/ — o desafio não foi des-estruturado`,
      });
    }
  }

  for (const patch of ["patches/solution-act2.patch", "patches/baseline-act2.patch"]) {
    if (!existsSync(join(dir, patch))) problems.push({ where, what: `falta ${patch}` });
  }

  for (const pattern of meta.forbidden ?? []) {
    try {
      void new RegExp(pattern);
    } catch {
      problems.push({ where, what: `forbidden inválido: ${pattern}` });
    }
  }

  if (meta.act2.axis === "orthogonal") {
    const walkthroughs = solutionDirs(exercise).map((solutionDir) =>
      join(solutionDir, "WALKTHROUGH.md"),
    );
    const mentions = walkthroughs.some(
      (file) =>
        existsSync(file) &&
        /would have absorbed|teria absorvido/i.test(readFileSync(file, "utf8")),
    );
    if (!mentions) {
      problems.push({
        where,
        what: "act2.axis é orthogonal: o WALKTHROUGH tem de nomear o que teria absorvido",
      });
    }
  }

  for (const file of fileTree(dir).filter((name) => name.endsWith(".md"))) {
    const full = join(dir, file);
    for (const link of markdownLinks(full)) {
      if (!existsSync(resolve(dirname(full), link))) {
        problems.push({ where, what: `link quebrado em ${file}: ${link}` });
      }
    }
  }
}

export function run(): number {
  const exercises = allExercises();
  const names = canonicalPatternNames();
  const problems: Problem[] = [];

  const seen = new Set<string>();
  for (const exercise of exercises) {
    if (seen.has(exercise.meta.id)) {
      problems.push({ where: exercise.meta.id, what: "id duplicado" });
    }
    seen.add(exercise.meta.id);
  }
  for (const exercise of exercises) {
    for (const prerequisite of exercise.meta.prerequisites) {
      if (!seen.has(prerequisite)) {
        problems.push({
          where: exercise.meta.id,
          what: `prerequisite inexistente: ${prerequisite}`,
        });
      }
    }
    checkExercise(exercise, names, problems);
  }

  line();
  line(bold("validate"));
  if (problems.length === 0) {
    line(`  ${TICK} ${exercises.length} exercício(s), nenhum problema estrutural`);
    line();
    return 0;
  }
  for (const problem of problems)
    line(`  ${CROSS} ${bold(problem.where)} ${dim("·")} ${problem.what}`);
  line();
  return 1;
}
