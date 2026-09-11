import type { InstrumentHooks } from "../pipeline.ts";

const PORT = "usb-wfc-1";

/** A wide-field survey camera: many short frames, flat-field calibrated. */
export const wideFieldCamera: InstrumentHooks = {
  name: "wide-field-camera",
  connect() {
    return { port: PORT };
  },
  calibrate() {
    return { reference: "flat-field-library-v3" };
  },
  capture(_connection, _calibration, _target) {
    return { frames: 12, exposureSeconds: 30 };
  },
  download(capture) {
    return { bytes: capture.frames * 8_400_000 };
  },
  disconnect() {
    // No handshake needed; the camera drops the line on its own.
  },
};
