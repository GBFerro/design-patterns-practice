export interface ConnectionLog {
  readonly port: string;
}

export interface CalibrationLog {
  readonly reference: string;
}

export interface CaptureLog {
  readonly frames: number;
  readonly exposureSeconds: number;
}

export interface DownloadLog {
  readonly bytes: number;
}

export interface StepLog {
  readonly step: string;
  readonly detail: string;
}

export interface NightLog {
  readonly instrument: string;
  readonly target: string;
  readonly steps: readonly StepLog[];
}

