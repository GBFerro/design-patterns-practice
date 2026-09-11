import assert from "node:assert/strict";
import { test } from "node:test";

import { ExposureSetup, SetupHistory } from "#exercise";

test("a fresh setup has the expected defaults", () => {
  const setup = new ExposureSetup();
  assert.equal(setup.instrumentName, "wide-field camera");
  assert.equal(setup.filterName, "clear");
  assert.equal(setup.exposureSeconds, 60);
  assert.equal(setup.binning, "1x1");
});

test("undo restores the values captured at save time", () => {
  const setup = new ExposureSetup();
  const history = new SetupHistory();
  setup.setInstrument("spectrograph");

  history.save(setup);
  setup.setInstrument("thermal imager");
  history.undo(setup);

  assert.equal(setup.instrumentName, "spectrograph");
});

test("undo restores every field, not just the one that changed since", () => {
  const setup = new ExposureSetup();
  const history = new SetupHistory();
  setup.setInstrument("spectrograph");
  setup.setFilter("h-alpha");
  setup.setExposureSeconds(300);
  setup.setBinning("2x2");

  history.save(setup);
  setup.setInstrument("thermal imager");
  setup.setFilter("clear");
  setup.setExposureSeconds(10);
  setup.setBinning("1x1");

  history.undo(setup);

  assert.equal(setup.instrumentName, "spectrograph");
  assert.equal(setup.filterName, "h-alpha");
  assert.equal(setup.exposureSeconds, 300);
  assert.equal(setup.binning, "2x2");
});

test("checkpoints undo in last-in-first-out order", () => {
  const setup = new ExposureSetup();
  const history = new SetupHistory();

  setup.setExposureSeconds(60);
  history.save(setup);
  setup.setExposureSeconds(120);
  history.save(setup);
  setup.setExposureSeconds(180);

  history.undo(setup);
  assert.equal(setup.exposureSeconds, 120);

  history.undo(setup);
  assert.equal(setup.exposureSeconds, 60);
});

test("undo with no saved checkpoints is a safe no-op and returns false", () => {
  const setup = new ExposureSetup();
  const history = new SetupHistory();
  setup.setInstrument("spectrograph");

  const restored = history.undo(setup);

  assert.equal(restored, false);
  assert.equal(setup.instrumentName, "spectrograph");
});

test("undo returns true when a checkpoint was restored", () => {
  const setup = new ExposureSetup();
  const history = new SetupHistory();

  history.save(setup);

  assert.equal(history.undo(setup), true);
});

test("depth reflects the number of unconsumed checkpoints", () => {
  const setup = new ExposureSetup();
  const history = new SetupHistory();
  assert.equal(history.depth, 0);

  history.save(setup);
  history.save(setup);
  assert.equal(history.depth, 2);

  history.undo(setup);
  assert.equal(history.depth, 1);

  history.undo(setup);
  assert.equal(history.depth, 0);
});
