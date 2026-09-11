import type { ExposureSetup } from "./setup.ts";

interface Checkpoint {
  instrumentName: string;
  filterName: string;
  exposureSeconds: number;
  binning: string;
}

/** Lets an operator save the current setup and undo back to it later. */
export class SetupHistory {
  private readonly checkpoints: Checkpoint[] = [];

  save(setup: ExposureSetup): void {
    this.checkpoints.push({
      instrumentName: setup.instrumentName,
      filterName: setup.filterName,
      exposureSeconds: setup.exposureSeconds,
      binning: setup.binning,
    });
  }

  /** Restores the most recent checkpoint onto `setup`. Returns false, and
   *  leaves `setup` untouched, if there is nothing to undo. */
  undo(setup: ExposureSetup): boolean {
    const checkpoint = this.checkpoints.pop();
    if (checkpoint === undefined) return false;
    setup.instrumentName = checkpoint.instrumentName;
    setup.filterName = checkpoint.filterName;
    setup.exposureSeconds = checkpoint.exposureSeconds;
    setup.binning = checkpoint.binning;
    return true;
  }

  get depth(): number {
    return this.checkpoints.length;
  }
}
