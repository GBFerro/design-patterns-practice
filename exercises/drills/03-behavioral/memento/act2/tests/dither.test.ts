import assert from "node:assert/strict";
import { test } from "node:test";

import { ExposureSetup, SetupHistory } from "#exercise";

test("ditherPattern starts at a sane default", () => {
  const setup = new ExposureSetup();
  assert.equal(setup.ditherPattern, "none");
});

test("undo restores ditherPattern after a change", () => {
  const setup = new ExposureSetup();
  const history = new SetupHistory();
  setup.setDitherPattern("spiral");

  history.save(setup);
  setup.setDitherPattern("box");
  history.undo(setup);

  assert.equal(setup.ditherPattern, "spiral");
});

test("undo restores ditherPattern alongside the other fields, from the same checkpoint", () => {
  const setup = new ExposureSetup();
  const history = new SetupHistory();
  setup.setInstrument("spectrograph");
  setup.setDitherPattern("box");

  history.save(setup);
  setup.setInstrument("thermal imager");
  setup.setDitherPattern("none");

  history.undo(setup);

  assert.equal(setup.instrumentName, "spectrograph");
  assert.equal(setup.ditherPattern, "box");
});

test("checkpoints undo ditherPattern in last-in-first-out order", () => {
  const setup = new ExposureSetup();
  const history = new SetupHistory();

  setup.setDitherPattern("none");
  history.save(setup);
  setup.setDitherPattern("spiral");
  history.save(setup);
  setup.setDitherPattern("box");

  history.undo(setup);
  assert.equal(setup.ditherPattern, "spiral");

  history.undo(setup);
  assert.equal(setup.ditherPattern, "none");
});
