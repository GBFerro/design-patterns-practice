import assert from "node:assert/strict";
import { test } from "node:test";

import { assemblePress, buildPress, createFeeder, createInkSystem, createPlate } from "#exercise";

test("a digital press is assembled from matched digital parts", () => {
  const press = buildPress("digital");
  assert.equal(press.family, "digital");
  assert.equal(
    press.describe(),
    "digital press: digital imaging plate, digital dry-toner cartridge, digital sheet feeder",
  );
});

test("an offset press is assembled from matched offset parts", () => {
  const press = buildPress("offset");
  assert.equal(press.family, "offset");
  assert.equal(press.describe(), "offset press: offset aluminum plate, offset wet-ink fountain, offset continuous feeder");
});

test("each part knows its own family", () => {
  assert.equal(createPlate("digital").family, "digital");
  assert.equal(createInkSystem("offset").family, "offset");
  assert.equal(createFeeder("digital").family, "digital");
});

test("assembling matched parts by hand works the same as buildPress", () => {
  const press = assemblePress(createPlate("offset"), createInkSystem("offset"), createFeeder("offset"));
  assert.equal(press.family, "offset");
});

test("assembling a press from mismatched parts throws", () => {
  assert.throws(
    () => assemblePress(createPlate("digital"), createInkSystem("offset"), createFeeder("digital")),
    /mismatched press family/,
  );
});

test("a single mismatched part among three is enough to throw", () => {
  assert.throws(() => assemblePress(createPlate("digital"), createInkSystem("digital"), createFeeder("offset")));
});
