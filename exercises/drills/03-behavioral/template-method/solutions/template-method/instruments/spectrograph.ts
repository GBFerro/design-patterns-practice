import type { InstrumentHooks } from "../pipeline.ts";

const PORT = "usb-spc-2";

/** A long-slit spectrograph: one long exposure, calibrated against an arc lamp. */
export const spectrograph: InstrumentHooks = {
  name: "spectrograph",
  connect() {
    return { port: PORT };
  },
  calibrate() {
    return { reference: "neon-argon-arc-lamp" };
  },
  capture(_connection, _calibration, _target) {
    return { frames: 1, exposureSeconds: 1800 };
  },
  download(capture) {
    return { bytes: capture.frames * 42_000_000 };
  },
  disconnect() {
    // The spectrograph parks its grating before the line drops.
  },
};
