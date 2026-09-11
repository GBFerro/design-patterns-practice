import assert from "node:assert/strict";
import { test } from "node:test";

import { createControlPanel } from "#exercise";

test("a fresh panel is not ready and cannot start", () => {
  const panel = createControlPanel();
  assert.equal(panel.readyLampLit, false);
  assert.equal(panel.startButtonEnabled, false);
});

test("locking focus alone is not enough to become ready", () => {
  const panel = createControlPanel();
  panel.setFocusLocked(true);
  assert.equal(panel.readyLampLit, false);
  assert.equal(panel.startButtonEnabled, false);
});

test("all four conditions together make the panel ready", () => {
  const panel = createControlPanel();
  panel.setFocusLocked(true);
  panel.setFilter("R");
  panel.setExposureSeconds(30);
  panel.setWeatherSevere(false);

  assert.equal(panel.readyLampLit, true);
  assert.equal(panel.startButtonEnabled, true);
});

test("severe weather overrides every other condition", () => {
  const panel = createControlPanel();
  panel.setFocusLocked(true);
  panel.setFilter("R");
  panel.setExposureSeconds(30);
  panel.setWeatherSevere(true);

  assert.equal(panel.readyLampLit, false);
  assert.equal(panel.startButtonEnabled, false);
});

test("an exposure of zero seconds is not a valid exposure", () => {
  const panel = createControlPanel();
  panel.setFocusLocked(true);
  panel.setFilter("R");
  panel.setExposureSeconds(0);

  assert.equal(panel.readyLampLit, false);
  assert.equal(panel.startButtonEnabled, false);
});

test("clearing the filter after being ready makes the panel not ready again", () => {
  const panel = createControlPanel();
  panel.setFocusLocked(true);
  panel.setFilter("V");
  panel.setExposureSeconds(15);
  assert.equal(panel.readyLampLit, true);

  panel.setFilter(null);
  assert.equal(panel.readyLampLit, false);
  assert.equal(panel.startButtonEnabled, false);
});

test("the ready lamp and the start button always agree", () => {
  const panel = createControlPanel();
  const combinations: Array<[boolean, string | null, number, boolean]> = [
    [true, "R", 30, false],
    [false, "R", 30, false],
    [true, null, 30, false],
    [true, "R", 0, false],
    [true, "R", 30, true],
  ];

  for (const [locked, filter, seconds, severe] of combinations) {
    panel.setFocusLocked(locked);
    panel.setFilter(filter);
    panel.setExposureSeconds(seconds);
    panel.setWeatherSevere(severe);
    assert.equal(panel.readyLampLit, panel.startButtonEnabled);
  }
});

test("two panels do not share widget state", () => {
  const first = createControlPanel();
  const second = createControlPanel();

  first.setFocusLocked(true);
  first.setFilter("R");
  first.setExposureSeconds(10);

  assert.equal(first.readyLampLit, true);
  assert.equal(second.readyLampLit, false);
});
