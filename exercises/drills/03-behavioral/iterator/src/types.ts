export interface LogEntry {
  readonly sequence: number;
  readonly timestampIso: string;
  readonly message: string;
}
