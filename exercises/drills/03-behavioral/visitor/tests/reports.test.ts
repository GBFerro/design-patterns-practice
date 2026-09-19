import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ExposureRecord,
  SeeingRecord,
  WeatherRecord,
  costSeconds,
  isAnomaly,
  toLine,
} from "#exercise";

test("toLine formats a seeing record", () => {
  assert.equal(toLine(new SeeingRecord(2.1)), 'seeing 2.1"');
});

test("toLine formats a weather record", () => {
  assert.equal(toLine(new WeatherRecord("hail", 9)), "weather: hail (severity 9)");
});

test("toLine formats an exposure record", () => {
  assert.equal(
    toLine(new ExposureRecord("wide-field camera", 300)),
    "exposure 300s on wide-field camera",
  );
});

test("costSeconds is zero for seeing and weather records", () => {
  assert.equal(costSeconds(new SeeingRecord(1.8)), 0);
  assert.equal(costSeconds(new WeatherRecord("clear", 0)), 0);
});

test("costSeconds is the exposure's own duration", () => {
  assert.equal(costSeconds(new ExposureRecord("spectrograph", 900)), 900);
});

test("a bad enough seeing reading is an anomaly, a good one is not", () => {
  assert.equal(isAnomaly(new SeeingRecord(3.5)), true);
  assert.equal(isAnomaly(new SeeingRecord(1.2)), false);
});

test("severe weather is an anomaly, mild weather is not", () => {
  assert.equal(isAnomaly(new WeatherRecord("storm", 8)), true);
  assert.equal(isAnomaly(new WeatherRecord("light haze", 2)), false);
});

test("an exposure record is never an anomaly on its own", () => {
  assert.equal(isAnomaly(new ExposureRecord("thermal imager", 5000)), false);
});

test("costSeconds sums correctly across a mixed night", () => {
  const night = [
    new SeeingRecord(2.0),
    new ExposureRecord("wide-field camera", 300),
    new WeatherRecord("clear", 0),
    new ExposureRecord("spectrograph", 600),
  ];

  const total = night.reduce((sum, record) => sum + costSeconds(record), 0);
  assert.equal(total, 900);
});
