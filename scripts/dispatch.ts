import { fail, line } from "./lib/ui.ts";
import * as basics from "./commands/basics.ts";
import { run as trade } from "./commands/trade.ts";
import { run as validate } from "./commands/validate.ts";
import { run as buildIndex } from "./commands/index-build.ts";
import { run as check } from "./commands/check.ts";
import { run as review } from "./commands/review.ts";

const [command = "", ...rest] = process.argv.slice(2);

type Handler = (argv: readonly string[]) => number;

const COMMANDS: Readonly<Record<string, Handler>> = {
  "": () => basics.list(),
  list: () => basics.list(),
  help: () => basics.list(),
  start: basics.start,
  test: basics.test,
  act2: basics.act2,
  shape: basics.shape,
  choose: basics.choose,
  diff: basics.diff,
  trade,
  review,
  validate: () => validate(),
  index: buildIndex,
  check: () => check(),
};

const handler = COMMANDS[command];
if (handler === undefined) {
  line();
  fail(`Comando desconhecido: "${command}". Rode ./dp para ver a lista.`);
}

try {
  process.exitCode = handler(rest);
} catch (error) {
  line();
  fail(error instanceof Error ? error.message : String(error));
}
