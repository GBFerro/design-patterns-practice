import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { repoRoot, resolveExercise } from "../lib/exercises.ts";
import { git } from "../lib/run.ts";
import { bold, dim, fail, line, parseArgs } from "../lib/ui.ts";

function attach(title: string, body: string): void {
  line();
  line(`### ${title}`);
  line();
  line(body.trimEnd());
}

function attachTree(title: string, dir: string, extension: string): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      attachTree(title, join(dir, entry.name), extension);
      continue;
    }
    if (!entry.name.endsWith(extension)) continue;
    attach(
      `${title} — ${entry.name}`,
      "```ts\n" + readFileSync(join(dir, entry.name), "utf8") + "```",
    );
  }
}

export function run(argv: readonly string[]): number {
  const { positional } = parseArgs(argv);
  if (positional[0] === undefined) fail("Qual exercício? Ex.: ./dp review strategy");
  const exercise = resolveExercise(positional[0]);
  const root = repoRoot();

  const rubric = join(root, "docs", "REVIEW.md");
  if (!existsSync(rubric)) fail("docs/REVIEW.md não existe.");

  line(readFileSync(rubric, "utf8").trimEnd());

  line();
  line("---");
  line();
  line(bold(`## O material — ${exercise.meta.title} (${exercise.meta.id})`));
  line();
  line(
    dim("As soluções publicadas NÃO estão neste pacote. Isso é deliberado: um revisor"),
  );
  line(dim("com gabarito avalia semelhança em vez de qualidade."));

  const focus = exercise.meta.reviewFocus ?? [];
  if (focus.length > 0) {
    line();
    line("### O que pesar mais neste exercício");
    line();
    for (const item of focus) line(`- ${item}`);
  }

  attach(
    "O enunciado do ato 1",
    readFileSync(join(exercise.dir, "README.en.md"), "utf8"),
  );
  const act2Readme = join(exercise.dir, "act2", "README.en.md");
  if (existsSync(act2Readme)) {
    attach("O requisito do ato 2", readFileSync(act2Readme, "utf8"));
  }
  const choice = join(exercise.dir, "CHOICE.md");
  if (existsSync(choice)) {
    attach(
      "A decisão que você registrou ANTES de ver o ato 2",
      readFileSync(choice, "utf8"),
    );
  }

  attachTree("A suíte intocada", join(exercise.dir, "tests"), ".ts");
  attachTree("O código como está", join(exercise.dir, "src"), ".ts");

  const log = git(
    ["--no-pager", "log", "--oneline", "--", join(exercise.rel, "src")],
    root,
  );
  attach(
    "A rota (git log do seu src/)",
    "```\n" + (log.out || "(sem commits)") + "\n```",
  );

  line();
  return 0;
}
