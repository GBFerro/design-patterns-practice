import { readFileSync } from "node:fs";

export interface FileChange {
  readonly path: string;
  readonly isNew: boolean;
  readonly hunks: number;
  readonly added: number;
  readonly removed: number;
}

export interface PatchSummary {
  readonly newFiles: readonly string[];
  readonly modifiedFiles: readonly FileChange[];
  /** Added + removed lines in files that already existed. The honest measure of
   *  how much standing code the change had to disturb. */
  readonly linesTouched: number;
  /** Hunks in files that already existed. This is the shotgun-surgery meter: a
   *  change spread over three hunks of one file touched three separate concerns. */
  readonly hunks: number;
}

/**
 * A small unified-diff reader. Deliberately not a dependency: the repo runs with
 * zero install, and this needs four numbers, not a parser.
 */
export function summarisePatch(text: string): PatchSummary {
  const changes: FileChange[] = [];
  let current: { path: string; isNew: boolean; hunks: number; added: number; removed: number } | undefined;

  const flush = (): void => {
    if (current !== undefined) changes.push({ ...current });
    current = undefined;
  };

  for (const line of text.split("\n")) {
    if (line.startsWith("diff --git ")) {
      flush();
      const path = line.split(" b/").at(-1) ?? "?";
      current = { path, isNew: false, hunks: 0, added: 0, removed: 0 };
      continue;
    }
    if (current === undefined) continue;

    if (line.startsWith("new file mode")) current.isNew = true;
    else if (line.startsWith("@@")) current.hunks += 1;
    else if (line.startsWith("+++") || line.startsWith("---")) continue;
    else if (line.startsWith("+")) current.added += 1;
    else if (line.startsWith("-")) current.removed += 1;
  }
  flush();

  const modifiedFiles = changes.filter((change) => !change.isNew);
  return {
    newFiles: changes.filter((change) => change.isNew).map((change) => change.path),
    modifiedFiles,
    linesTouched: modifiedFiles.reduce((sum, file) => sum + file.added + file.removed, 0),
    hunks: modifiedFiles.reduce((sum, file) => sum + file.hunks, 0),
  };
}

export function summarisePatchFile(file: string): PatchSummary {
  return summarisePatch(readFileSync(file, "utf8"));
}

export interface BudgetVerdict {
  readonly withinBudget: boolean;
  readonly reasons: readonly string[];
}

export function checkBudget(
  summary: PatchSummary,
  budget: { maxFilesModified: number; maxLinesModified: number; maxHunks?: number },
): BudgetVerdict {
  const reasons: string[] = [];
  if (summary.modifiedFiles.length > budget.maxFilesModified) {
    reasons.push(
      `${summary.modifiedFiles.length} existing files modified, budget allows ${budget.maxFilesModified}`,
    );
  }
  if (summary.linesTouched > budget.maxLinesModified) {
    reasons.push(
      `${summary.linesTouched} lines touched in existing files, budget allows ${budget.maxLinesModified}`,
    );
  }
  if (budget.maxHunks !== undefined && summary.hunks > budget.maxHunks) {
    reasons.push(`${summary.hunks} hunks in existing files, budget allows ${budget.maxHunks}`);
  }
  return { withinBudget: reasons.length === 0, reasons };
}
