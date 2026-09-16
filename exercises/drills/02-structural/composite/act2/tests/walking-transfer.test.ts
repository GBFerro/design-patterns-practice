import assert from "node:assert/strict";
import { test } from "node:test";

import { Journey, Line, Segment, WalkingTransfer, totalMinutes } from "#exercise";

test("a walking transfer totals its own walking time", () => {
  assert.equal(totalMinutes(new WalkingTransfer(4)), 4);
});

test("a journey totals a walking transfer alongside a line and a segment", () => {
  const line = new Line("Red Line", [new Segment(6), new Segment(4)]);
  const journey = new Journey([line, new WalkingTransfer(4), new Segment(3)]);
  assert.equal(totalMinutes(journey), 17);
});

test("a journey of journeys totals a walking transfer at any depth", () => {
  const inner = new Journey([new WalkingTransfer(4), new Segment(3)]);
  const outer = new Journey([inner, new WalkingTransfer(2)]);
  assert.equal(totalMinutes(outer), 9);
});
