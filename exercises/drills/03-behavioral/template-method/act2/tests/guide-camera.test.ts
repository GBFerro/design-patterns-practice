import assert from "node:assert/strict";
import { test } from "node:test";

import { runNight } from "#exercise";

test("the guide camera's log has no calibrate step", () => {
  const log = runNight("guide-camera", "M31");
  assert.deepEqual(
    log.steps.map((step) => step.step),
    ["connect", "capture", "download", "disconnect"],
  );
});

test("the guide camera still connects, captures, downloads and disconnects in order", () => {
  const log = runNight("guide-camera", "M31");
  assert.equal(log.instrument, "guide-camera");
  assert.equal(log.steps[0]!.step, "connect");
  assert.equal(log.steps.at(-1)!.step, "disconnect");
});

// The pipeline must stay generic: skipping calibrate for one instrument must not
// touch what the other three report.
test("the existing three instruments still calibrate", () => {
  for (const instrument of [
    "wide-field-camera",
    "spectrograph",
    "thermal-imager",
  ] as const) {
    const log = runNight(instrument, "M31");
    assert.ok(log.steps.some((step) => step.step === "calibrate"));
  }
});
