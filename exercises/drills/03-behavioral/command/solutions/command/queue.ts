import type { Command } from "./command.ts";

/** Runs commands, and remembers what it ran. */
export class CommandQueue {
  private readonly done: Command[] = [];

  run(command: Command): void {
    command.execute();
    this.done.push(command);
  }

  get history(): readonly string[] {
    return this.done.map((command) => command.description);
  }
}
