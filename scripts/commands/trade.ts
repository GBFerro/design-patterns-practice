import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { repoRoot, resolveExercise, type Exercise } from "../lib/exercises.ts";
import { checkBudget, summarisePatchFile, type PatchSummary } from "../lib/patch.ts";
import { git, runTests } from "../lib/run.ts";
import { bold, CROSS, cyan, dim, fail, line, parseArgs, TICK } from "../lib/ui.ts";

const SOLUTION_PATCH = "patches/solution-act2.patch";
const BASELINE_PATCH = "patches/baseline-act2.patch";

/** Count the files, interfaces and directories the act-1 structure introduced. */
function structureCost(exercise: Exercise, slug: string): string {
  const root = repoRoot();
  const countFiles = (dir: string): string[] => {
    const out = git(["ls-files", dir], root);
    return out.out.split("\n").filter((path) => path.endsWith(".ts"));
  };
  const countInterfaces = (paths: readonly string[]): number =>
    paths
      .map((path) => readFileSync(join(root, path), "utf8"))
      .join("\n")
      .match(/^export interface /gm)?.length ?? 0;

  const srcFiles = countFiles(join(exercise.rel, "src"));
  const solutionFiles = countFiles(join(exercise.rel, "solutions", slug));
  const files = solutionFiles.length - srcFiles.length;
  const interfaces = countInterfaces(solutionFiles) - countInterfaces(srcFiles);
  const signed = (value: number): string => `${value >= 0 ? "+" : ""}${value}`;
  return (
    `${signed(files)} arquivos · ${signed(interfaces)} interface de extensão · ` +
    `${solutionFiles.length} módulos no total`
  );
}

function describe(summary: PatchSummary): string {
  const news = summary.newFiles.length;
  const mods = summary.modifiedFiles.length;
  return [
    `+${news} ${news === 1 ? "arquivo novo" : "arquivos novos"}`,
    `${mods} ${mods === 1 ? "arquivo existente editado" : "arquivos existentes editados"}`,
    `${summary.linesTouched} linhas tocadas`,
    `${summary.hunks} ${summary.hunks === 1 ? "hunk" : "hunks"}`,
  ].join(" · ");
}

/** Apply a patch to an isolated copy of the exercise and run the act-2 suite there. */
function provePatch(
  exercise: Exercise,
  patchRelative: string,
  solution: string | undefined,
): boolean {
  const temp = mkdtempSync(join(tmpdir(), "dp-trade-"));
  try {
    const work = join(temp, "ex");
    cpSync(exercise.dir, work, { recursive: true });
    const applied = git(["apply", patchRelative], work);
    if (!applied.ok) {
      line(`  ${CROSS} o patch não aplica mais: ${applied.out}`);
      return false;
    }
    const options = solution === undefined ? { act2: true } : { act2: true, solution };
    const result = runTests(exercise, { ...options, cwd: work, quiet: true });
    return result.ok;
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

export function run(argv: readonly string[]): number {
  const { positional } = parseArgs(argv);
  const query = positional[0];
  if (query === undefined) fail("Qual exercício? Ex.: ./dp trade strategy");

  const exercise = resolveExercise(query);
  const { meta } = exercise;
  const budget = meta.act2.extensionBudget;
  const absorbing = meta.solutions.find((solution) => solution.absorbsAct2 === true);

  line();
  line(`${bold(meta.title)} ${dim("·")} ${dim(meta.id)}`);
  line();
  line(bold("Ato 1 — o que a estrutura custou"));
  if (absorbing === undefined) {
    line(`  ${dim("nenhuma solução declara absorbsAct2")}`);
  } else {
    line(`  src/ → solutions/${absorbing.slug}/    ${structureCost(exercise, absorbing.slug)}`);
  }

  line();
  line(bold(`Ato 2 — ${meta.act2.summary}`));
  line(
    `  ${dim(`orçamento: ≤ ${budget.maxFilesModified} arquivo existente, ≤ ${budget.maxLinesModified} linhas tocadas`)}`,
  );
  line();

  let ok = true;

  const solutionPatch = join(exercise.dir, SOLUTION_PATCH);
  if (existsSync(solutionPatch) && absorbing !== undefined) {
    const summary = summarisePatchFile(solutionPatch);
    const verdict = checkBudget(summary, budget);
    const proved = provePatch(exercise, SOLUTION_PATCH, absorbing.slug);
    ok = ok && verdict.withinBudget && proved;
    line(`  ${verdict.withinBudget ? TICK : CROSS} ${bold("com o pattern")}   ${describe(summary)}`);
    for (const reason of verdict.reasons) line(`      ${CROSS} ${reason}`);
    line(`      ${proved ? TICK : CROSS} o ato 2 passa nessa rota${proved ? "" : " — NÃO passa"}`);
  } else {
    line(`  ${dim("sem patches/solution-act2.patch — nada medido")}`);
    ok = false;
  }

  const baselinePatch = join(exercise.dir, BASELINE_PATCH);
  if (existsSync(baselinePatch)) {
    const summary = summarisePatchFile(baselinePatch);
    const verdict = checkBudget(summary, budget);
    const proved = provePatch(exercise, BASELINE_PATCH, undefined);
    // The counterfactual is supposed to BLOW the budget. If it fits, the pattern
    // bought nothing here and the exercise is making a claim it cannot support.
    ok = ok && !verdict.withinBudget && proved;
    line(
      `  ${verdict.withinBudget ? CROSS : TICK} ${bold("sem o pattern")}   ${describe(summary)}`,
    );
    line(
      `      ${proved ? TICK : CROSS} o ato 2 também passa sem o pattern${proved ? " (tinha de passar: o requisito é o mesmo)" : " — o contrafactual está quebrado"}`,
    );
    if (verdict.withinBudget) {
      line(
        `      ${CROSS} ${bold("o contrafactual caberia no orçamento")} — este exercício não prova nada`,
      );
    } else {
      line(`      ${dim(`estoura por: ${verdict.reasons.join("; ")}`)}`);
    }
  } else {
    line(`  ${dim("sem patches/baseline-act2.patch — o contrafactual não foi medido")}`);
    ok = false;
  }

  line();
  line(
    cyan(
      "  Os dois números são a tese: o que a estrutura cobrou, e o que a próxima mudança custou.",
    ),
  );
  line();
  return ok ? 0 : 1;
}
