import type { CalibrationLog, CaptureLog, ConnectionLog, DownloadLog, NightLog, StepLog } from "./types.ts";

/**
 * The skeleton every instrument goes through, in a fixed order. An instrument
 * supplies the *content* of each step; it never decides the order, and never
 * decides whether a step runs.
 */
export interface InstrumentHooks {
  readonly name: string;
  connect(): ConnectionLog;
  calibrate(connection: ConnectionLog): CalibrationLog;
  capture(connection: ConnectionLog, calibration: CalibrationLog, target: string): CaptureLog;
  download(capture: CaptureLog): DownloadLog;
  disconnect(connection: ConnectionLog): void;
}

export function runPipeline(hooks: InstrumentHooks, target: string): NightLog {
  const steps: StepLog[] = [];

  const connection = hooks.connect();
  steps.push({ step: "connect", detail: connection.port });

  const calibration = hooks.calibrate(connection);
  steps.push({ step: "calibrate", detail: calibration.reference });

  const capture = hooks.capture(connection, calibration, target);
  steps.push({ step: "capture", detail: `${capture.frames} frames @ ${capture.exposureSeconds}s` });

  const download = hooks.download(capture);
  steps.push({ step: "download", detail: `${download.bytes} bytes` });

  hooks.disconnect(connection);
  steps.push({ step: "disconnect", detail: connection.port });

  return { instrument: hooks.name, target, steps };
}
