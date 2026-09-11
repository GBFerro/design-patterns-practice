import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { allExercises, repoRoot, type Exercise } from "../lib/exercises.ts";
import { bold, CROSS, dim, line, TICK } from "../lib/ui.ts";

const LANGUAGE_EN = "🌐 **English** · [🇧🇷 Português](./README.pt.md)";
const LANGUAGE_PT = "[🌐 English](./README.en.md) · 🇧🇷 **Português**";

const VERDICT_ORDER = ["essential", "situational", "niche", "avoid"] as const;

function patternNames(): Record<string, string[]> {
  const data = JSON.parse(
    readFileSync(join(repoRoot(), "docs", "pattern-names.json"), "utf8"),
  ) as Record<string, string[]>;
  return {
    creational: data["creational"] ?? [],
    structural: data["structural"] ?? [],
    behavioral: data["behavioral"] ?? [],
  };
}

function dots(level: number): string {
  return ("●".repeat(level) + "○○○").slice(0, 3);
}

function exerciseRow(exercise: Exercise): string {
  const { meta } = exercise;
  return `| [\`${meta.id}\`](./${exercise.rel}/) | ${meta.title} | ${dots(meta.difficulty)} | ~${meta.estimatedMinutes} min | \`${meta.verdict ?? "-"}\` | ${meta.act2.axis === "orthogonal" ? "⚠ orthogonal" : "aligned"} |`;
}

function readmeBody(language: "en" | "pt"): string {
  const exercises = allExercises();
  const header = language === "en" ? LANGUAGE_EN : LANGUAGE_PT;
  const intro =
    language === "en"
      ? [
          "# design-patterns-practice",
          "",
          "Hands-on TypeScript exercises for the 23 GoF design patterns. **Every exercise has two acts.**",
          "",
          "1. **Act 1** — the code is under a specific pressure. You restructure it. The suite is green before you start and green when you finish: behaviour is preserved.",
          "2. **Act 2** — `./dp act2 <id>` reveals a change nobody told you about. You implement it, and `./dp trade <id>` measures both sides of the bargain: what the structure cost you, and what the change cost with it and without it.",
          "",
          "A pattern is not proven by a green suite. It is proven by what the second change costs — so this repository measures that, exercise by exercise, and publishes the counterfactual next to the answer.",
          "",
          "> **Unofficial.** No connection to the authors of *Design Patterns* or to refactoring.guru. Both are prerequisites, not replaced by anything here. No text, pseudocode, illustration or example domain is taken from either.",
          "",
          "**It runs with zero install.** Node 22.6 or newer is the only requirement; the harness is Node's own test runner and its TypeScript stripping.",
          "",
          "```bash",
          "git clone <your fork> && cd design-patterns-practice",
          "./dp                      # the exercise list",
          "./dp start strategy       # act 1: the brief, and the suite in watch mode",
          "./dp act2 strategy        # act 2: the change you were not told about",
          "./dp trade strategy       # paid × bought, against the declared budget",
          "```",
          "",
          "- [The catalogue](./docs/CATALOG.md) — the 23 patterns, each with a verdict",
          "- [How to practise](./docs/HOW-TO-PRACTICE.md)",
          "- [The recommended order](./docs/PATH.md) — which is *not* the folder order",
          "- [What TypeScript already solved](./docs/TYPESCRIPT.md)",
          "- [Design notes](./docs/DESIGN.md) · [Roadmap](./docs/ROADMAP.md) · [Contributing](./CONTRIBUTING.md)",
        ]
      : [
          "# design-patterns-practice",
          "",
          "Exercícios de design patterns (GoF) em TypeScript. **Todo exercício tem dois atos.**",
          "",
          "1. **Ato 1** — o código está sob uma pressão específica. Você reestrutura. A suíte nasce verde e termina verde: o comportamento é preservado.",
          "2. **Ato 2** — `./dp act2 <id>` revela uma mudança que ninguém te contou. Você implementa, e `./dp trade <id>` mede os dois lados da troca: o que a estrutura cobrou, e o que a mudança custou com e sem ela.",
          "",
          "Um pattern não é provado por uma suíte verde. É provado pelo custo da segunda mudança — então este repositório mede isso, exercício por exercício, e publica o contrafactual ao lado da resposta.",
          "",
          "> **Não oficial.** Sem vínculo com os autores de *Design Patterns* nem com o refactoring.guru. As duas fontes são pré-requisito e não são substituídas por nada aqui. Nenhum texto, pseudocódigo, ilustração ou domínio de exemplo vem delas.",
          "",
          "**Roda com zero instalação.** Node 22.6 ou mais novo é o único requisito; o harness é o test runner do próprio Node e o stripping de tipos dele.",
          "",
          "```bash",
          "git clone <seu fork> && cd design-patterns-practice",
          "./dp                      # a lista de exercícios",
          "./dp start strategy       # ato 1: o enunciado e a suíte em watch",
          "./dp act2 strategy        # ato 2: a mudança que você não sabia",
          "./dp trade strategy       # pagou × comprou, contra o orçamento declarado",
          "```",
          "",
          "- [O catálogo](./docs/CATALOG.md) — os 23 patterns, cada um com um veredito",
          "- [Como praticar](./docs/HOW-TO-PRACTICE.md)",
          "- [A ordem recomendada](./docs/PATH.md) — que **não** é a ordem das pastas",
          "- [O que o TypeScript já resolveu](./docs/TYPESCRIPT.md)",
          "- [Notas de design](./docs/DESIGN.md) · [Roadmap](./docs/ROADMAP.md) · [Contribuindo](./CONTRIBUTING.md)",
        ];

  const tableHead =
    language === "en"
      ? ["| Id | Pattern | Difficulty | Time | Verdict | Act 2 axis |", "| --- | --- | --- | --- | --- | --- |"]
      : ["| Id | Pattern | Dificuldade | Tempo | Veredito | Eixo do ato 2 |", "| --- | --- | --- | --- | --- | --- |"];

  const sections: string[] = [];
  for (const [key, label] of [
    ["drill", language === "en" ? "Drills — the pattern is named" : "Drills — o pattern é nomeado"],
    ["choice", language === "en" ? "Choices — you pick, and act 2 decides" : "Choices — você escolhe, e o ato 2 decide"],
    ["kata", language === "en" ? "Katas — nothing is named" : "Katas — nada é nomeado"],
  ] as const) {
    const rows = exercises.filter((exercise) => exercise.meta.type === key);
    if (rows.length === 0) continue;
    sections.push("", `## ${label}`, "", ...tableHead, ...rows.map(exerciseRow));
  }

  const done = exercises.length;
  const progress =
    language === "en"
      ? `${done} of 36 exercises written (23 drills · 8 choices · 5 katas).`
      : `${done} de 36 exercícios escritos (23 drills · 8 choices · 5 katas).`;

  return [header, "", ...intro, ...sections, "", "---", "", dimLine(progress), ""].join("\n");
}

function dimLine(text: string): string {
  return `_${text}_`;
}

function catalogBody(): string {
  const exercises = allExercises();
  const byPattern = new Map<string, Exercise>();
  for (const exercise of exercises) {
    for (const pattern of exercise.meta.patterns) {
      if (exercise.meta.type === "drill") byPattern.set(pattern, exercise);
    }
  }

  const out: string[] = [
    "# The catalogue",
    "",
    "The 23 patterns of *Design Patterns* (Gamma, Helm, Johnson, Vlissides, 1994), each",
    "linked to its drill. This file is generated by `./dp index` — do not edit it by hand.",
    "",
    "## The verdicts are an opinion",
    "",
    "The `verdict` column is **the opinion of this repository's author**, not of the GoF and",
    "not of refactoring.guru. It says how often the pattern earns its keep in TypeScript in",
    "2026, and nothing about whether the 1994 book was right.",
    "",
    "| Verdict | What it means |",
    "| --- | --- |",
    "| `essential` | You will use this. Recognising it is worth more than memorising it. |",
    "| `situational` | Solves a real and narrow problem. The common mistake is using it outside that problem. |",
    "| `niche` | Almost always the answer is something else. The drill exists so you recognise the rare case. |",
    "| `avoid` | The drill teaches what it was protecting, and why the road goes elsewhere. |",
    "",
    "Every drill whose verdict is not `essential` owes the reader a paragraph in its",
    "`WALKTHROUGH.md` saying **what would change the author's mind**. If you disagree with a",
    "verdict, that paragraph is the place the discussion starts — open an issue against it.",
    "",
    "`Interpreter` is the only pattern with no refactoring.guru page; it is cited from the GoF",
    "alone, and is marked as a stretch exercise.",
    "",
  ];

  const groups = patternNames();
  for (const [category, label] of [
    ["creational", "Creational"],
    ["structural", "Structural"],
    ["behavioral", "Behavioral"],
  ] as const) {
    out.push(`## ${label}`, "", "| Pattern | Drill | Verdict | Status |", "| --- | --- | --- | --- |");
    for (const pattern of groups[category] ?? []) {
      const exercise = byPattern.get(pattern);
      const status = exercise === undefined ? "⬜" : "✅";
      const link = exercise === undefined ? "—" : `[\`${exercise.meta.id}\`](../${exercise.rel}/)`;
      const verdict = exercise?.meta.verdict ?? "—";
      out.push(`| ${pattern} | ${link} | \`${verdict}\` | ${status} |`);
    }
    out.push("");
  }

  const written = [...byPattern.keys()].length;
  out.push("---", "", `_${written} of 23 drills written._`, "");

  const counts = VERDICT_ORDER.map((verdict) => {
    const total = exercises.filter((exercise) => exercise.meta.verdict === verdict).length;
    return `${verdict}: ${total}`;
  }).join(" · ");
  out.push(`_Verdicts so far — ${counts}._`, "");
  return out.join("\n");
}

function choicesBody(): string {
  const exercises = allExercises().filter((exercise) => exercise.meta.type === "choice");
  const out: string[] = [
    "# Where each pattern is a candidate",
    "",
    "Generated by `./dp index` from the candidate lists the choice exercises declare.",
    "",
    "This index is deliberately one-way: it tells you **which exercises consider a pattern**,",
    "never which one wins. A choice exercise is named after its domain for the same reason —",
    "naming the answer in the path would answer it.",
    "",
  ];
  if (exercises.length === 0) {
    out.push("_No choice exercises written yet. They arrive in phase 4._", "");
    return out.join("\n");
  }
  const byCandidate = new Map<string, string[]>();
  for (const exercise of exercises) {
    for (const candidate of exercise.meta.candidates ?? []) {
      const list = byCandidate.get(candidate) ?? [];
      list.push(exercise.meta.id);
      byCandidate.set(candidate, list);
    }
  }
  out.push("| Candidate | Considered in |", "| --- | --- |");
  for (const [candidate, ids] of [...byCandidate.entries()].sort()) {
    out.push(`| ${candidate} | ${ids.map((id) => `\`${id}\``).join(", ")} |`);
  }
  out.push("");
  return out.join("\n");
}

interface Generated {
  readonly path: string;
  readonly body: string;
}

function generated(): Generated[] {
  const english = readmeBody("en");
  return [
    { path: "README.en.md", body: english },
    { path: "README.pt.md", body: readmeBody("pt") },
    // GitHub renders only README.md, and a language suffix is not recognised - so the
    // default language is written twice, from the same source, and --check proves they agree.
    { path: "README.md", body: english },
    { path: "docs/CATALOG.md", body: catalogBody() },
    { path: "docs/CHOICES.md", body: choicesBody() },
  ];
}

export function run(argv: readonly string[]): number {
  const root = repoRoot();
  const checkOnly = argv.includes("--check");
  const files = generated();

  line();
  line(bold(checkOnly ? "index --check" : "index"));
  let drifted = 0;
  for (const file of files) {
    const full = join(root, file.path);
    let current = "";
    try {
      current = readFileSync(full, "utf8");
    } catch {
      current = "";
    }
    if (current === file.body) {
      line(`  ${TICK} ${file.path} ${dim("em dia")}`);
      continue;
    }
    if (checkOnly) {
      drifted += 1;
      line(`  ${CROSS} ${file.path} ${dim("divergente do gerado — rode ./dp index")}`);
      continue;
    }
    writeFileSync(full, file.body);
    line(`  ${TICK} ${file.path} ${dim("reescrito")}`);
  }
  line();
  return drifted === 0 ? 0 : 1;
}
