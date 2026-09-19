import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DomeRecord,
  ExposureRecord,
  SeeingRecord,
  WeatherRecord,
  costSeconds,
  isAnomaly,
  operatorNote,
  toLine,
} from "#exercise";

test("a seeing record never gets an operator note", () => {
  assert.equal(operatorNote(new SeeingRecord(3.8)), null);
});

test("severe weather gets an operator note about the dome", () => {
  assert.equal(operatorNote(new WeatherRecord("storm", 8)), "consider closing the dome");
});

test("mild weather gets no operator note", () => {
  assert.equal(operatorNote(new WeatherRecord("clear", 1)), null);
});

test("a long exposure gets an operator note about guiding", () => {
  assert.equal(
    operatorNote(new ExposureRecord("spectrograph", 1801)),
    "long exposure - verify guiding",
  );
});

test("a short exposure gets no operator note", () => {
  assert.equal(operatorNote(new ExposureRecord("wide-field camera", 300)), null);
});

test("a dome record formats its own line", () => {
  assert.equal(toLine(new DomeRecord("closed", "wind gust")), "dome closed: wind gust");
});

test("a dome record costs no telescope time", () => {
  assert.equal(costSeconds(new DomeRecord("opened", "clear skies")), 0);
});

test("a dome record is never an anomaly on its own", () => {
  assert.equal(isAnomaly(new DomeRecord("closed", "storm")), false);
});

test("a dome record has no operator note of its own", () => {
  assert.equal(operatorNote(new DomeRecord("closed", "storm")), null);
});
