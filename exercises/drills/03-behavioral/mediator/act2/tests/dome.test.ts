import assert from "node:assert/strict";
import { test } from "node:test";

import { createControlPanel } from "#exercise";

function readyPanel(): ReturnType<typeof createControlPanel> {
  const panel = createControlPanel();
  panel.setFocusLocked(true);
  panel.setFilter("R");
  panel.setExposureSeconds(30);
  return panel;
}

test("the dome starts closed, and a closed dome blocks readiness even if everything else is set", () => {
  const panel = readyPanel();
  assert.equal(panel.readyLampLit, false);
  assert.equal(panel.startButtonEnabled, false);
});

test("opening the dome, with every other condition already met, makes the panel ready", () => {
  const panel = readyPanel();
  panel.setDomeOpen(true);
  assert.equal(panel.readyLampLit, true);
  assert.equal(panel.startButtonEnabled, true);
});

test("a severe weather banner no longer blocks readiness once the dome is open", () => {
  const panel = readyPanel();
  panel.setDomeOpen(true);
  panel.setWeatherSevere(true);

  assert.equal(panel.readyLampLit, true);
  assert.equal(panel.startButtonEnabled, true);
});

test("setWeatherSevere never throws, even though it no longer affects readiness", () => {
  const panel = readyPanel();
  assert.doesNotThrow(() => panel.setWeatherSevere(true));
  assert.doesNotThrow(() => panel.setWeatherSevere(false));
});

test("closing the dome again after being ready makes the panel not ready", () => {
  const panel = readyPanel();
  panel.setDomeOpen(true);
  assert.equal(panel.readyLampLit, true);

  panel.setDomeOpen(false);
  assert.equal(panel.readyLampLit, false);
  assert.equal(panel.startButtonEnabled, false);
});

test("an open dome alone, with no other condition met, is not ready", () => {
  const panel = createControlPanel();
  panel.setDomeOpen(true);

  assert.equal(panel.readyLampLit, false);
  assert.equal(panel.startButtonEnabled, false);
});

test("the ready lamp and the start button still agree, across dome and weather combinations", () => {
  const panel = readyPanel();
  const combinations: Array<[boolean, boolean]> = [
    [true, false],
    [true, true],
    [false, false],
    [false, true],
  ];

  for (const [domeOpen, severe] of combinations) {
    panel.setDomeOpen(domeOpen);
    panel.setWeatherSevere(severe);
    assert.equal(panel.readyLampLit, panel.startButtonEnabled);
  }
});

test("two panels do not share dome state", () => {
  const first = readyPanel();
  const second = readyPanel();

  first.setDomeOpen(true);

  assert.equal(first.readyLampLit, true);
  assert.equal(second.readyLampLit, false);
});
