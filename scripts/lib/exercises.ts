import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface SolutionMeta {
  readonly slug: string;
  readonly title: string;
  readonly absorbsAct2?: boolean;
  readonly tradeoff: string;
}

export interface Act2Meta {
  readonly axis: "aligned" | "orthogonal";
  readonly summary: string;
  readonly extensionBudget: {
    readonly maxFilesModified: number;
    readonly maxLinesModified: number;
    readonly maxHunks?: number;
  };
}

export interface ExerciseMeta {
  readonly id: string;
  readonly title: string;
  readonly type: "drill" | "choice" | "kata";
  readonly category?: "creational" | "structural" | "behavioral";
  readonly patterns: readonly string[];
  readonly candidates?: readonly string[];
  readonly verdict?: "essential" | "situational" | "niche" | "avoid";
  readonly difficulty: number;
  readonly estimatedMinutes: number;
  readonly prerequisites: readonly string[];
  readonly apiFrozen: boolean;
  readonly providesTests: boolean;
  readonly translations: readonly string[];
  readonly world?: string;
  readonly subDomain?: string;
  readonly act2: Act2Meta;
  readonly forbidden?: readonly string[];
  readonly solutions: readonly SolutionMeta[];
  readonly reviewFocus?: readonly string[];
}

export interface Exercise {
  /** Absolute path to the exercise directory. */
  readonly dir: string;
  /** Path relative to the repository root. */
  readonly rel: string;
  readonly meta: ExerciseMeta;
}

export function repoRoot(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  while (!existsSync(join(dir, "package.json")) || !existsSync(join(dir, "exercises"))) {
    const parent = dirname(dir);
    if (parent === dir) throw new Error("Could not locate the repository root.");
    dir = parent;
  }
  return dir;
}

function walkForMeta(dir: string, found: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkForMeta(full, found);
    else if (entry.name === "meta.json") found.push(dir);
  }
}

let cache: Exercise[] | undefined;

export function allExercises(): readonly Exercise[] {
  if (cache !== undefined) return cache;
  const root = repoRoot();
  const dirs: string[] = [];
  const exercisesDir = join(root, "exercises");
  if (existsSync(exercisesDir)) walkForMeta(exercisesDir, dirs);
  cache = dirs
    .map((dir) => ({
      dir,
      rel: relative(root, dir),
      meta: JSON.parse(readFileSync(join(dir, "meta.json"), "utf8")) as ExerciseMeta,
    }))
    .sort((a, b) => a.rel.localeCompare(b.rel));
  return cache;
}

function candidateKeys(exercise: Exercise): string[] {
  const { meta } = exercise;
  const slug = exercise.rel.split("/").at(-1) ?? "";
  return [
    meta.id,
    meta.id.replace(/^(drill|choice|kata)-/, ""),
    slug,
    meta.title.toLowerCase(),
    ...meta.patterns.map((pattern) => pattern.toLowerCase()),
  ].map((key) => key.toLowerCase());
}

/**
 * Ids are deliberately fuzzy: `strategy`, `Strategy`, `drill-strategy` and the
 * folder name all resolve to the same exercise. Nobody should have to memorise
 * an id scheme.
 */
export function resolveExercise(query: string): Exercise {
  const wanted = query.trim().toLowerCase();
  if (wanted === "") throw new Error("Which exercise? Run `./dp` to see the list.");

  const exercises = allExercises();
  const exact = exercises.filter((exercise) => candidateKeys(exercise).includes(wanted));
  if (exact.length === 1) return exact[0]!;

  const partial = exercises.filter((exercise) =>
    candidateKeys(exercise).some((key) => key.includes(wanted)),
  );
  if (partial.length === 1) return partial[0]!;

  if (partial.length === 0) {
    throw new Error(
      `No exercise matches "${query}".\nKnown: ${exercises.map((e) => e.meta.id).join(", ")}`,
    );
  }
  throw new Error(
    `"${query}" is ambiguous. Did you mean: ${partial.map((e) => e.meta.id).join(", ")}?`,
  );
}

export function solutionDirs(exercise: Exercise): string[] {
  const base = join(exercise.dir, "solutions");
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(base, entry.name));
}

export function countLines(file: string): number {
  return readFileSync(file, "utf8").split("\n").length;
}

export function isDirectory(path: string): boolean {
  return existsSync(path) && statSync(path).isDirectory();
}

export function absoluteFromRoot(...parts: string[]): string {
  return resolve(repoRoot(), ...parts);
}
