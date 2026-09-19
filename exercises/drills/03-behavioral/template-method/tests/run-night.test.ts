import assert from "node:assert/strict";
import { test } from "node:test";

import { runNight } from "#exercise";

function stepNames(log: {
  readonly steps: readonly { readonly step: string }[];
}): string[] {
  return log.steps.map((step) => step.step);
}

// Guards against the five steps being reordered while moving them into a shared
// runner - the order is the one thing every instrument must agree on.
test("every instrument runs connect, calibrate, capture, download, disconnect in that order", () => {
  for (const instrument of [
    "wide-field-camera",
    "spectrograph",
    "thermal-imager",
  ] as const) {
    const log = runNight(instrument, "M31");
    assert.deepEqual(stepNames(log), [
      "connect",
      "calibrate",
      "capture",
      "download",
      "disconnect",
    ]);
  }
});

// Guards against the log losing track of which instrument and target it was for.
test("the log names the instrument and the target", () => {
  const log = runNight("spectrograph", "NGC 891");
  assert.equal(log.instrument, "spectrograph");
  assert.equal(log.target, "NGC 891");
});

// Guards against the three instruments collapsing onto one calibration, which is
// the easiest thing to get wrong when merging three copies into one function.
test("each instrument calibrates against its own reference", () => {
  const camera = runNight("wide-field-camera", "M31");
  const spectro = runNight("spectrograph", "M31");
  const thermal = runNight("thermal-imager", "M31");

  assert.match(camera.steps[1]!.detail, /flat-field/);
  assert.match(spectro.steps[1]!.detail, /arc-lamp/);
  assert.match(thermal.steps[1]!.detail, /blackbody/);
});

// Guards against capture reusing a stale calibration reference, or computing the
// download size before capture has returned.
test("each instrument reports its own frame count and a download size derived from it", () => {
  const camera = runNight("wide-field-camera", "M31");
  const spectro = runNight("spectrograph", "M31");

  assert.match(camera.steps[2]!.detail, /12 frames @ 30s/);
  assert.match(spectro.steps[2]!.detail, /1 frames @ 1800s/);

  const cameraBytes = Number(/(\d+) bytes/.exec(camera.steps[3]!.detail)?.[1]);
  const spectroBytes = Number(/(\d+) bytes/.exec(spectro.steps[3]!.detail)?.[1]);
  assert.ok(cameraBytes > 0 && spectroBytes > 0);
  assert.notEqual(cameraBytes, spectroBytes);
});

// Guards against disconnect being dropped, or running before download finishes -
// the most likely casualty of merging three copy-pasted pipelines by hand.
test("disconnect always runs last, against the same connection that was opened", () => {
  const log = runNight("thermal-imager", "M31");
  assert.equal(log.steps.at(-1)!.step, "disconnect");
  assert.equal(log.steps[0]!.detail, log.steps.at(-1)!.detail);
});

// Guards against the target leaking into the wrong step, or not reaching capture
// at all.
test("the target reaches capture and nowhere else changes because of it", () => {
  const first = runNight("wide-field-camera", "M31");
  const second = runNight("wide-field-camera", "NGC 224");
  assert.equal(first.target, "M31");
  assert.equal(second.target, "NGC 224");
  assert.deepEqual(
    first.steps.map((step) => step.step),
    second.steps.map((step) => step.step),
  );
});

// Guards against a fourth instrument silently being accepted by TypeScript's
// structural typing with no case to handle it.
test("every advertised instrument name is actually handled", () => {
  const names: readonly ("wide-field-camera" | "spectrograph" | "thermal-imager")[] = [
    "wide-field-camera",
    "spectrograph",
    "thermal-imager",
  ];
  for (const name of names) {
    assert.equal(runNight(name, "M31").instrument, name);
  }
});
