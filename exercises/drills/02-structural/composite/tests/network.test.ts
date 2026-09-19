import assert from "node:assert/strict";
import { test } from "node:test";

import { Journey, Line, Segment, Stop, totalMinutes } from "#exercise";

test("a segment totals its own travel time", () => {
  assert.equal(totalMinutes(new Segment(6)), 6);
});

test("a stop totals its own dwell time", () => {
  assert.equal(totalMinutes(new Stop("Mill Ave", 1)), 1);
});

test("a line totals its segments and stops", () => {
  const line = new Line("Red Line", [
    new Segment(6),
    new Stop("Mill Ave", 1),
    new Segment(4),
  ]);
  assert.equal(totalMinutes(line), 11);
});

test("an empty line totals to zero", () => {
  assert.equal(totalMinutes(new Line("Ghost Line", [])), 0);
});

test("a journey totals its lines and segments", () => {
  const line = new Line("Red Line", [
    new Segment(6),
    new Stop("Mill Ave", 1),
    new Segment(4),
  ]);
  const journey = new Journey([line, new Segment(3)]);
  assert.equal(totalMinutes(journey), 14);
});

test("a journey of journeys totals all the way down", () => {
  const line = new Line("Red Line", [
    new Segment(6),
    new Stop("Mill Ave", 1),
    new Segment(4),
  ]);
  const journey = new Journey([line, new Segment(3)]);
  const outerJourney = new Journey([journey, new Segment(2)]);
  assert.equal(totalMinutes(outerJourney), 16);
});
