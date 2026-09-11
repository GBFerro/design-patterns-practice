import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

import { allExercises, repoRoot } from "../lib/exercises.ts";
import { runTests } from "../lib/run.ts";
import { bold, CROSS, dim, line, TICK, yellow } from "../lib/ui.ts";
import { run as validate } from "./validate.ts";
import { run as buildIndex } from "./index-build.ts";
import { run as trade } from "./trade.ts";

interface Step {
  readonly name: string;
  readonly run: () => boolean;
  /** A step that is skipped rather than failed when its tool is absent. */
  readonly optionalTool?: string;
}

function captureOutput<T>(body: () => T): T {
  const original = process.stdout.write.bind(process.stdout);
  (process.stdout as unknown as { write: (chunk: string) => boolean }).write = () => true;
  try {
    return body();
  } finally {
    (process.stdout as unknown as { write: typeof original }).write = original;
  }
}

function act1GreenAgainstSrc(): boolean {
  return allExercises()
    .filter((exercise) => exercise.meta.providesTests)
    .every((exercise) => runTests(exercise, { quiet: true }).ok);
}

function act1GreenAgainstSolutions(): boolean {
  return allExercises().every((exercise) =>
    exercise.meta.solutions.every(
      (solution) => runTests(exercise, { solution: solution.slug, quiet: true }).ok,
    ),
  );
}

/**
 * The invariant people forget: act 2 must FAIL against the act-1 challenge. If it
 * passes, the new requirement was already satisfied and act 2 proves nothing.
 */
function act2FailsAgainstSrc(): boolean {
  return allExercises().every((exercise) => !runTests(exercise, { act2: true, quiet: true }).ok);
}

function tradeWithinBudget(): boolean {
  return allExercises().every((exercise) => captureOutput(() => trade([exercise.meta.id])) === 0);
}

function optional(tool: string, args: readonly string[]): boolean {
  const result = spawnSync(tool, args, { cwd: repoRoot(), encoding: "utf8" });
  if (result.status !== 0) process.stdout.write(`${result.stdout ?? ""}${result.stderr ?? ""}`);
  return result.status === 0;
}

const STEPS: readonly Step[] = [
  { name: "act 1 verde contra src/", run: act1GreenAgainstSrc },
  { name: "act 1 verde contra toda solução", run: act1GreenAgainstSolutions },
  { name: "act 2 falha contra src/ (é a invariante)", run: act2FailsAgainstSrc },
  { name: "trade dentro do orçamento, contrafactual estourando", run: tradeWithinBudget },
  { name: "metadados e estrutura", run: () => captureOutput(() => validate()) === 0 },
  { name: "índices em dia", run: () => captureOutput(() => buildIndex(["--check"])) === 0 },
  {
    name: "tipos (tsc --noEmit)",
    optionalTool: "tsc",
    run: () => optional("npx", ["--no-install", "tsc", "--noEmit"]),
  },
  {
    name: "lint",
    optionalTool: "oxlint",
    run: () => optional("npx", ["--no-install", "oxlint"]),
  },
  {
    name: "formato",
    optionalTool: "oxfmt",
    run: () => optional("npx", ["--no-install", "oxfmt", "--check", "."]),
  },
];

/**
 * Only the repository's own optional devDependencies count. A globally installed
 * tsc of an unrelated major version is worse than an honestly skipped step.
 */
function toolPresent(tool: string): boolean {
  return existsSync(join(repoRoot(), "node_modules", ".bin", tool));
}

export function run(): number {
  line();
  line(bold("./dp check"));
  line(dim("na ordem que falha mais rápido"));
  line();

  let failed = 0;
  let skipped = 0;
  for (const step of STEPS) {
    if (step.optionalTool !== undefined && !toolPresent(step.optionalTool)) {
      skipped += 1;
      line(`  ${yellow("~")} ${step.name} ${dim(`— ${step.optionalTool} não instalado, pulado`)}`);
      continue;
    }
    const ok = step.run();
    line(`  ${ok ? TICK : CROSS} ${step.name}`);
    if (!ok) {
      failed += 1;
      break;
    }
  }

  line();
  if (failed > 0) {
    line(`${CROSS} ${bold("check vermelho")}`);
    line();
    return 1;
  }
  line(`${TICK} ${bold("check verde")}${skipped > 0 ? dim(` (${skipped} passo(s) opcional(is) pulado(s))`) : ""}`);
  if (skipped > 0) {
    line(
      dim(
        "  Os passos pulados precisam de tsc/oxlint/oxfmt: `npm i -D typescript oxlint oxfmt`.\n" +
          "  Praticar não precisa deles. A CI do GitHub instala e roda os três.",
      ),
    );
  }
  line();
  return 0;
}
