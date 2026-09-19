import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { allExercises, repoRoot, resolveExercise } from "../lib/exercises.ts";
import { git, runTests } from "../lib/run.ts";
import {
  bold,
  CROSS,
  cyan,
  difficultyDots,
  dim,
  fail,
  line,
  parseArgs,
  TICK,
  verdictBadge,
  yellow,
} from "../lib/ui.ts";

export function list(): number {
  const exercises = allExercises();
  line();
  line(bold("design-patterns-practice"));
  line(dim("Cada exercício tem dois atos. O segundo é o que avalia o primeiro."));
  line();
  if (exercises.length === 0) {
    line(dim("  Nenhum exercício ainda."));
  }
  for (const exercise of exercises) {
    const { meta } = exercise;
    line(
      `  ${bold(meta.id.padEnd(22))} ${difficultyDots(meta.difficulty)} ` +
        `${String(meta.estimatedMinutes).padStart(3)}min  ${verdictBadge(meta.verdict).padEnd(20)} ` +
        `${dim(meta.subDomain ?? "")}`,
    );
  }
  line();
  line(bold("Comandos"));
  for (const [command, help] of [
    ["./dp start <id>", "imprime o enunciado do ato 1 e roda a suíte em watch"],
    ["./dp test <id>", "roda a suíte (--act2, --solution <slug>)"],
    ["./dp act2 <id>", "revela o requisito do ato 2 e marca a base da medição"],
    ["./dp trade <id>", "pagou × comprou, contra o orçamento declarado"],
    ["./dp shape <id>", "o construto proibido ainda está no seu src/? (advisory)"],
    ["./dp choose <id>", "registra sua escolha antes de liberar o ato 2 (choices)"],
    ["./dp diff <id>", "compara com a solução (--steps, --walkthrough, --act2)"],
    ["./dp review <id>", "a rubrica de revisão, sem gabarito"],
    ["./dp check", "tudo que a CI roda, na ordem que falha mais rápido"],
  ]) {
    line(`  ${bold((command ?? "").padEnd(22))} ${dim(help ?? "")}`);
  }
  line();
  return 0;
}

function printMarkdown(file: string): void {
  if (!existsSync(file)) {
    line(dim(`  (${file} não existe)`));
    return;
  }
  line();
  line(readFileSync(file, "utf8").trimEnd());
  line();
}

export function start(argv: readonly string[]): number {
  const { positional } = parseArgs(argv);
  if (positional[0] === undefined) fail("Qual exercício? Ex.: ./dp start strategy");
  const exercise = resolveExercise(positional[0]);
  printMarkdown(join(exercise.dir, "README.en.md"));
  line(cyan("Rodando a suíte do ato 1 em watch. Ctrl-C para sair."));
  const result = runTests(exercise, { watch: true });
  return result.ok ? 0 : 1;
}

export function test(argv: readonly string[]): number {
  const { positional, flags } = parseArgs(argv);
  if (positional[0] === undefined) fail("Qual exercício? Ex.: ./dp test strategy");
  const exercise = resolveExercise(positional[0]);
  const solution = typeof flags["solution"] === "string" ? flags["solution"] : undefined;
  const options = {
    act2: flags["act2"] === true,
    ...(solution === undefined ? {} : { solution }),
    ...(flags["coverage"] === true ? { coverage: true } : {}),
  };
  return runTests(exercise, options).ok ? 0 : 1;
}

export function act2(argv: readonly string[]): number {
  const { positional } = parseArgs(argv);
  if (positional[0] === undefined) fail("Qual exercício? Ex.: ./dp act2 strategy");
  const exercise = resolveExercise(positional[0]);

  if (exercise.meta.type === "choice" && !existsSync(join(exercise.dir, "CHOICE.md"))) {
    line();
    line(yellow("Este é um exercício de escolha, e você ainda não registrou a sua."));
    line(`Rode:  ./dp choose ${exercise.meta.id} --pattern <nome> --because "..."`);
    line(dim("Escrever a justificativa antes do discriminador é o exercício."));
    line();
    return 1;
  }

  const root = repoRoot();
  const head = git(["rev-parse", "HEAD"], root);
  if (head.ok) {
    mkdirSync(join(root, ".dp"), { recursive: true });
    writeFileSync(join(root, ".dp", `act2-base-${exercise.meta.id}`), `${head.out}\n`);
  }

  printMarkdown(join(exercise.dir, "act2", "README.en.md"));
  line(
    cyan(
      "Quando terminar:  ./dp test " +
        exercise.meta.id +
        " --act2   e depois  ./dp trade " +
        exercise.meta.id,
    ),
  );
  line();
  return 0;
}

export function shape(argv: readonly string[]): number {
  const { positional } = parseArgs(argv);
  if (positional[0] === undefined) fail("Qual exercício? Ex.: ./dp shape strategy");
  const exercise = resolveExercise(positional[0]);
  const forbidden = exercise.meta.forbidden ?? [];

  line();
  line(bold(`shape · ${exercise.meta.id}`));
  if (forbidden.length === 0) {
    line(dim("  Este exercício não declara construtos proibidos."));
    line();
    return 0;
  }

  const root = repoRoot();
  const files = git(["ls-files", join(exercise.rel, "src")], root)
    .out.split("\n")
    .filter(Boolean);
  let found = 0;
  for (const pattern of forbidden) {
    const regex = new RegExp(pattern);
    const hits = files.filter((file) =>
      regex.test(readFileSync(join(root, file), "utf8")),
    );
    if (hits.length > 0) {
      found += 1;
      line(`  ${CROSS} ${dim("/" + pattern + "/")} ainda presente em ${hits.join(", ")}`);
    } else {
      line(`  ${TICK} ${dim("/" + pattern + "/")} não aparece mais`);
    }
  }
  line();
  line(
    dim(
      found === 0
        ? "  Verde aqui não é o mesmo que certo: isto é uma regex, não uma revisão de desenho."
        : "  Advisory. Isto sai 0 de propósito — o critério de verdade é o ./dp trade.",
    ),
  );
  line();
  return 0;
}

export function choose(argv: readonly string[]): number {
  const { positional, flags } = parseArgs(argv);
  if (positional[0] === undefined)
    fail(
      'Qual exercício? Ex.: ./dp choose picking-policy --pattern State --because "..."',
    );
  const exercise = resolveExercise(positional[0]);
  const pattern = flags["pattern"];
  const because = flags["because"];

  if (exercise.meta.type !== "choice") {
    line();
    line(
      yellow(
        `${exercise.meta.id} é um ${exercise.meta.type}: o pattern já está no enunciado.`,
      ),
    );
    line(dim("Não há escolha a registrar. ./dp choose só vale para exercises/choices/."));
    line();
    return 1;
  }
  if (typeof pattern !== "string" || typeof because !== "string") {
    fail('Faltou --pattern <nome|none> ou --because "por quê".');
  }

  const file = join(exercise.dir, "CHOICE.md");
  writeFileSync(
    file,
    [
      `# A minha escolha — ${exercise.meta.title}`,
      "",
      `**Escolhi:** ${pattern}`,
      "",
      `**Porque:** ${because}`,
      "",
      `_Registrado em ${new Date().toISOString()}, antes de ver o ato 2._`,
      "",
      "Quando o ato 2 chegar, volte aqui e escreva o que ele custou de verdade.",
      "O `./dp review` compara as duas coisas, e é o melhor feedback que o repo dá.",
      "",
    ].join("\n"),
  );
  line();
  line(`${TICK} Escolha registrada em ${dim(file)}`);
  line(`Agora: ./dp act2 ${exercise.meta.id}`);
  line();
  return 0;
}

export function diff(argv: readonly string[]): number {
  const { positional, flags } = parseArgs(argv);
  if (positional[0] === undefined)
    fail("Qual exercício? Ex.: ./dp diff strategy --steps");
  const exercise = resolveExercise(positional[0]);

  const green = runTests(exercise, { quiet: true });
  if (!green.ok) {
    line();
    line(`${CROSS} ${green.fail} testes falhando.`);
    line("  A comparação só faz sentido depois que o comportamento estiver preservado —");
    line(
      "  é isso que reestruturar quer dizer. Rode `./dp test " +
        exercise.meta.id +
        "` e volte.",
    );
    line();
    return 1;
  }

  const solutions = exercise.meta.solutions;
  const wanted =
    typeof flags["solution"] === "string" ? flags["solution"] : solutions[0]?.slug;
  const solution = solutions.find((candidate) => candidate.slug === wanted);
  if (solution === undefined) fail(`Solução "${String(wanted)}" não existe.`);

  if (solutions.length > 1 && flags["solution"] === undefined && flags["all"] !== true) {
    line();
    line(bold("Este exercício tem mais de uma saída publicada. Escolha:"));
    for (const candidate of solutions) {
      line(`  ${bold(candidate.slug)} — ${candidate.title}`);
      line(`    ${dim(candidate.tradeoff)}`);
    }
    line();
    line(dim("  ./dp diff " + exercise.meta.id + " --solution <slug>   (ou --all)"));
    line();
    return 0;
  }

  const base = join(exercise.dir, "solutions", solution.slug);
  if (flags["steps"] === true) return printFile(join(base, "STEPS.md"));
  if (flags["walkthrough"] === true) return printFile(join(base, "WALKTHROUGH.md"));
  if (flags["act2"] === true) return printFile(join(base, "ACT2.md"));

  const root = repoRoot();
  const result = git(
    [
      "--no-pager",
      "diff",
      "--no-index",
      "--",
      join(exercise.rel, "src"),
      join(exercise.rel, "solutions", solution.slug),
    ],
    root,
  );
  line(result.out);
  line();
  line(
    dim(
      "  O diff de código vai ser barulhento: seus nomes não são os meus. A comparação\n" +
        "  que ensina é `git log --oneline` contra o STEPS.md — por isso --steps existe.",
    ),
  );
  return 0;
}

function printFile(file: string): number {
  printMarkdown(file);
  return 0;
}
