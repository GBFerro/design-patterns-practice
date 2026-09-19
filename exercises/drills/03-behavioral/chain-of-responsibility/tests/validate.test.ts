import assert from "node:assert/strict";
import { test } from "node:test";

import { validateRequest } from "#exercise";
import type { ObservationRequest, Telescope } from "#exercise";

const meridian: Telescope = {
  name: "Meridian",
  hasMovableDome: true,
  availableInstruments: ["wide-field-camera", "spectrograph"],
  nightlyExposureBudgetSeconds: 7200,
};

const ridgeline: Telescope = {
  name: "Ridgeline",
  hasMovableDome: false,
  availableInstruments: ["wide-field-camera"],
  nightlyExposureBudgetSeconds: 3600,
};

function validRequest(overrides: Partial<ObservationRequest> = {}): ObservationRequest {
  return {
    altitudeDegrees: 45,
    moonSeparationDegrees: 30,
    instrumentName: "wide-field-camera",
    exposureSeconds: 600,
    cloudCoverPercent: 10,
    ...overrides,
  };
}

test("a request that meets every condition passes", () => {
  assert.equal(validateRequest(validRequest(), meridian), null);
});

test("a target below the minimum altitude is refused", () => {
  const result = validateRequest(validRequest({ altitudeDegrees: 10 }), meridian);
  assert.equal(result, "target is below the minimum altitude");
});

test("a target too close to the moon is refused", () => {
  const result = validateRequest(validRequest({ moonSeparationDegrees: 5 }), meridian);
  assert.equal(result, "target is too close to the moon");
});

test("an instrument not on this telescope is refused", () => {
  const result = validateRequest(
    validRequest({ instrumentName: "spectrograph" }),
    ridgeline,
  );
  assert.equal(result, "spectrograph is not available on Ridgeline");
});

test("an exposure past the nightly budget is refused", () => {
  const result = validateRequest(validRequest({ exposureSeconds: 4000 }), ridgeline);
  assert.equal(result, "exposure exceeds the nightly budget");
});

test("near-zenith pointing is refused on a telescope with a movable dome", () => {
  const result = validateRequest(validRequest({ altitudeDegrees: 89 }), meridian);
  assert.equal(result, "near-zenith pointing risks dome slit clearance");
});

test("near-zenith pointing is allowed on a telescope without a movable dome", () => {
  const result = validateRequest(validRequest({ altitudeDegrees: 89 }), ridgeline);
  assert.equal(result, null);
});

test("heavy cloud cover is refused", () => {
  const result = validateRequest(validRequest({ cloudCoverPercent: 80 }), meridian);
  assert.equal(result, "cloud cover is too high");
});

test("when two conditions fail at once, the earlier check in the order is the one reported", () => {
  const result = validateRequest(
    validRequest({
      altitudeDegrees: 10,
      moonSeparationDegrees: 5,
      cloudCoverPercent: 90,
    }),
    meridian,
  );
  assert.equal(result, "target is below the minimum altitude");
});
