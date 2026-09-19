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
    instrumentWarmupComplete: true,
    ...overrides,
  };
}

test("a request with a completed warmup passes on Meridian", () => {
  assert.equal(validateRequest(validRequest(), meridian), null);
});

test("an instrument that has not completed warmup is refused", () => {
  const result = validateRequest(
    validRequest({ instrumentWarmupComplete: false }),
    meridian,
  );
  assert.equal(result, "instrument has not completed its warmup sequence");
});

test("the warmup check runs after moon separation, not before", () => {
  const result = validateRequest(
    validRequest({ moonSeparationDegrees: 5, instrumentWarmupComplete: false }),
    meridian,
  );
  assert.equal(result, "target is too close to the moon");
});

test("the warmup check runs before instrument availability, not after", () => {
  const result = validateRequest(
    validRequest({ instrumentWarmupComplete: false, instrumentName: "spectrograph" }),
    ridgeline,
  );
  assert.equal(result, "instrument has not completed its warmup sequence");
});

test("on Ridgeline, heavy cloud cover is reported even when altitude is also too low", () => {
  const result = validateRequest(
    validRequest({ cloudCoverPercent: 90, altitudeDegrees: 10 }),
    ridgeline,
  );
  assert.equal(result, "cloud cover is too high");
});

test("on Meridian, altitude is still reported first, even with heavy cloud cover", () => {
  const result = validateRequest(
    validRequest({ cloudCoverPercent: 90, altitudeDegrees: 10 }),
    meridian,
  );
  assert.equal(result, "target is below the minimum altitude");
});

test("on Ridgeline, altitude is still refused once the weather passes", () => {
  const result = validateRequest(validRequest({ altitudeDegrees: 10 }), ridgeline);
  assert.equal(result, "target is below the minimum altitude");
});

test("Ridgeline still skips dome clearance, even under the new order", () => {
  const result = validateRequest(validRequest({ altitudeDegrees: 89 }), ridgeline);
  assert.equal(result, null);
});
