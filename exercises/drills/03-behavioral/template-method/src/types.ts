export interface StepLog {
  readonly step: string;
  readonly detail: string;
}

export interface NightLog {
  readonly instrument: string;
  readonly target: string;
  readonly steps: readonly StepLog[];
}
