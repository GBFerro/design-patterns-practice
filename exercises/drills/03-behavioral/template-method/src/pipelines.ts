import type { NightLog, StepLog } from "./types.ts";

function runWideFieldCameraNight(target: string): NightLog {
  const steps: StepLog[] = [];

  const port = "usb-wfc-1";
  steps.push({ step: "connect", detail: port });

  const reference = "flat-field-library-v3";
  steps.push({ step: "calibrate", detail: reference });

  const frames = 12;
  const exposureSeconds = 30;
  steps.push({ step: "capture", detail: `${frames} frames @ ${exposureSeconds}s` });

  const bytes = frames * 8_400_000;
  steps.push({ step: "download", detail: `${bytes} bytes` });

  steps.push({ step: "disconnect", detail: port });

  return { instrument: "wide-field-camera", target, steps };
}

function runSpectrographNight(target: string): NightLog {
  const steps: StepLog[] = [];

  const port = "usb-spc-2";
  steps.push({ step: "connect", detail: port });

  const reference = "neon-argon-arc-lamp";
  steps.push({ step: "calibrate", detail: reference });

  const frames = 1;
  const exposureSeconds = 1800;
  steps.push({ step: "capture", detail: `${frames} frames @ ${exposureSeconds}s` });

  const bytes = frames * 42_000_000;
  steps.push({ step: "download", detail: `${bytes} bytes` });

  steps.push({ step: "disconnect", detail: port });

  return { instrument: "spectrograph", target, steps };
}

function runThermalImagerNight(target: string): NightLog {
  const steps: StepLog[] = [];

  const port = "usb-thm-3";
  steps.push({ step: "connect", detail: port });

  const reference = "blackbody-77k";
  steps.push({ step: "calibrate", detail: reference });

  const frames = 200;
  const exposureSeconds = 2;
  steps.push({ step: "capture", detail: `${frames} frames @ ${exposureSeconds}s` });

  const bytes = frames * 1_200_000;
  steps.push({ step: "download", detail: `${bytes} bytes` });

  steps.push({ step: "disconnect", detail: port });

  return { instrument: "thermal-imager", target, steps };
}

export function runNight(instrument: string, target: string): NightLog {
  switch (instrument) {
    case "wide-field-camera":
      return runWideFieldCameraNight(target);
    case "spectrograph":
      return runSpectrographNight(target);
    case "thermal-imager":
      return runThermalImagerNight(target);
    default:
      throw new Error(
        `Unknown instrument "${instrument}". Available: wide-field-camera, spectrograph, thermal-imager.`,
      );
  }
}

export function instrumentNames(): readonly string[] {
  return ["wide-field-camera", "spectrograph", "thermal-imager"];
}
