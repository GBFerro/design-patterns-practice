import type { InstrumentHooks } from "../pipeline.ts";

const PORT = "usb-thm-3";

/** A thermal imager: cooled against a blackbody reference before every run. */
export const thermalImager: InstrumentHooks = {
  name: "thermal-imager",
  connect() {
    return { port: PORT };
  },
  calibrate() {
    return { reference: "blackbody-77k" };
  },
  capture(_connection, _calibration, _target) {
    return { frames: 200, exposureSeconds: 2 };
  },
  download(capture) {
    return { bytes: capture.frames * 1_200_000 };
  },
  disconnect() {
    // The cooler stays on; only the data line disconnects.
  },
};
