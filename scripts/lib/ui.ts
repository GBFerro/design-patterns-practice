const useColour = process.stdout.isTTY === true && process.env["NO_COLOR"] === undefined;

function paint(code: string, text: string): string {
  return useColour ? `\u001b[${code}m${text}\u001b[0m` : text;
}

export const bold = (text: string): string => paint("1", text);
export const dim = (text: string): string => paint("2", text);
export const green = (text: string): string => paint("32", text);
export const red = (text: string): string => paint("31", text);
export const yellow = (text: string): string => paint("33", text);
export const cyan = (text: string): string => paint("36", text);

export const TICK = green("✓");
export const CROSS = red("✗");
export const DOT = dim("·");

export function heading(text: string): void {
  process.stdout.write(`\n${bold(text)}\n`);
}

export function line(text = ""): void {
  process.stdout.write(`${text}\n`);
}

export function difficultyDots(level: number): string {
  const filled = "●".repeat(Math.max(0, Math.min(3, level)));
  return (filled + "○".repeat(3 - filled.length)).slice(0, 3);
}

export function verdictBadge(verdict: string | undefined): string {
  switch (verdict) {
    case "essential":
      return green("essential");
    case "situational":
      return cyan("situational");
    case "niche":
      return yellow("niche");
    case "avoid":
      return red("avoid");
    default:
      return dim("-");
  }
}

export function fail(message: string): never {
  process.stderr.write(`${CROSS} ${message}\n`);
  process.exit(1);
  // Unreachable: process.exit is typed `never`. The throw keeps this function
  // valid for a reader who has not installed @types/node.
  throw new Error(message);
}

export interface Flags {
  readonly positional: readonly string[];
  readonly flags: Readonly<Record<string, string | boolean>>;
}

export function parseArgs(argv: readonly string[]): Flags {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]!;
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }
    const name = token.slice(2);
    const next = argv[index + 1];
    if (next !== undefined && !next.startsWith("--")) {
      flags[name] = next;
      index += 1;
    } else {
      flags[name] = true;
    }
  }
  return { positional, flags };
}
