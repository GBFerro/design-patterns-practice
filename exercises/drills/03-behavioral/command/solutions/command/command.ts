/** A queued action as an object: something that can do itself, and undo itself. */
export interface Command {
  readonly description: string;
  execute(): void;
  undo(): void;
}
