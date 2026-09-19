import { ConcreteExposureMemento, type ExposureMemento } from "./memento.ts";

/** The exposure setup being configured before the next shot. The only code
 *  that ever constructs or reads a `ConcreteExposureMemento`. */
export class ExposureSetup {
  instrumentName = "wide-field camera";
  filterName = "clear";
  exposureSeconds = 60;
  binning = "1x1";

  setInstrument(name: string): void {
    this.instrumentName = name;
  }

  setFilter(name: string): void {
    this.filterName = name;
  }

  setExposureSeconds(seconds: number): void {
    this.exposureSeconds = seconds;
  }

  setBinning(binning: string): void {
    this.binning = binning;
  }

  createMemento(): ExposureMemento {
    return new ConcreteExposureMemento(
      this.instrumentName,
      this.filterName,
      this.exposureSeconds,
      this.binning,
    );
  }

  restore(memento: ExposureMemento): void {
    const state = memento as ConcreteExposureMemento;
    this.instrumentName = state.instrumentName;
    this.filterName = state.filterName;
    this.exposureSeconds = state.exposureSeconds;
    this.binning = state.binning;
  }
}
