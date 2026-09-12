import assert from "node:assert/strict";
import { test } from "node:test";

import { buildPress, createFeeder, createInkSystem, createPlate } from "#exercise";

test("a wide-format press is assembled from matched wide-format parts", () => {
  const press = buildPress("wide-format");
  assert.equal(press.family, "wide-format");
  assert.equal(
    press.describe(),
    "wide-format press: wide-format vinyl plate, wide-format solvent-ink fountain, wide-format roll feeder",
  );
});

test("wide-format's ink system is not offset's, even though both are called a fountain", () => {
  const wideFormat = createInkSystem("wide-format");
  const offset = createInkSystem("offset");
  assert.notEqual(wideFormat.describe(), offset.describe());
});

test("each wide-format part knows its own family", () => {
  assert.equal(createPlate("wide-format").family, "wide-format");
  assert.equal(createFeeder("wide-format").family, "wide-format");
});
