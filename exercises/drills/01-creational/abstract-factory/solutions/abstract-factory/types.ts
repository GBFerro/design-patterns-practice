export type PressFamily = "digital" | "offset";

export interface Plate {
  readonly family: PressFamily;
  describe(): string;
}

export interface InkSystem {
  readonly family: PressFamily;
  describe(): string;
}

export interface Feeder {
  readonly family: PressFamily;
  describe(): string;
}

/** A press assembled from one matched set of parts. */
export interface Press {
  readonly family: PressFamily;
  describe(): string;
}
