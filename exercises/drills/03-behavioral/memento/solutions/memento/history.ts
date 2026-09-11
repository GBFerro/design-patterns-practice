import type { ExposureMemento } from "./memento.ts";
import type { ExposureSetup } from "./setup.ts";

/** Lets an operator save the current setup and undo back to it later.
 *  Never reads a single field off `ExposureSetup` - only ever asks it to
 *  make a memento, holds it, and hands it back. */
export class SetupHistory {
  private readonly checkpoints: ExposureMemento[] = [];

  save(setup: ExposureSetup): void {
    this.checkpoints.push(setup.createMemento());
  }

  /** Restores the most recent checkpoint onto `setup`. Returns false, and
   *  leaves `setup` untouched, if there is nothing to undo. */
  undo(setup: ExposureSetup): boolean {
    const checkpoint = this.checkpoints.pop();
    if (checkpoint === undefined) return false;
    setup.restore(checkpoint);
    return true;
  }

  get depth(): number {
    return this.checkpoints.length;
  }
}
