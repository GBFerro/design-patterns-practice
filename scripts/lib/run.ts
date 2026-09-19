import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import type { Exercise } from "./exercises.ts";

/** The only two flags the harness needs. No test runner to install. */
const NODE_FLAGS = [
  "--experimental-transform-types",
  "--disable-warning=ExperimentalWarning",
];

export interface TestRunOptions {
  /** Run the act-2 suite instead of the act-1 suite. */
  readonly act2?: boolean;
  /** Resolve `#exercise` to this solution instead of to `src/`. */
  readonly solution?: string;
  /** Keep running on change. */
  readonly watch?: boolean;
  /** Collect coverage (used by the reader-coverage gate on tests-free katas). */
  readonly coverage?: boolean;
  /** Run inside this directory instead of the exercise directory. */
  readonly cwd?: string;
  readonly quiet?: boolean;
}

export interface TestResult {
  readonly ok: boolean;
  readonly pass: number;
  readonly fail: number;
  readonly output: string;
}

export function runTests(exercise: Exercise, options: TestRunOptions = {}): TestResult {
  const cwd = options.cwd ?? exercise.dir;
  const pattern = options.act2 ? "act2/tests/*.test.ts" : "tests/*.test.ts";
  if (!existsSync(join(cwd, options.act2 ? "act2/tests" : "tests"))) {
    return {
      ok: true,
      pass: 0,
      fail: 0,
      output: `no ${options.act2 ? "act2" : "act1"} suite\n`,
    };
  }

  const args = [...NODE_FLAGS];
  if (options.solution !== undefined)
    args.push(`--conditions=solution-${options.solution}`);
  if (options.coverage === true) args.push("--experimental-test-coverage");
  if (options.watch === true) args.push("--watch");
  args.push("--test", pattern);

  const result = spawnSync(process.execPath, args, {
    cwd,
    encoding: "utf8",
    stdio: options.watch === true ? "inherit" : "pipe",
  });

  if (options.watch === true)
    return { ok: result.status === 0, pass: 0, fail: 0, output: "" };

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (options.quiet !== true) process.stdout.write(output);
  return {
    ok: result.status === 0,
    pass: Number(/^# pass (\d+)$/m.exec(output)?.[1] ?? 0),
    fail: Number(/^# fail (\d+)$/m.exec(output)?.[1] ?? 0),
    output,
  };
}

export function hasCommand(command: string): boolean {
  return (
    spawnSync("sh", ["-c", `command -v ${command}`], { stdio: "ignore" }).status === 0
  );
}

export function git(args: readonly string[], cwd: string): { ok: boolean; out: string } {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  return {
    ok: result.status === 0,
    out: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim(),
  };
}
