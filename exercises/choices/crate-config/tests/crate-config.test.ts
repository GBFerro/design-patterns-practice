import assert from "node:assert/strict";
import { test } from "node:test";

import { buildDomesticCrate, buildExportCrate } from "#exercise";

test("buildExportCrate is wood, fastened with nails", () => {
  const crate = buildExportCrate(120, 80, 100, 500);
  assert.equal(crate.material, "wood");
  assert.equal(crate.fastener, "nails");
  assert.deepEqual(
    { lengthCm: crate.lengthCm, widthCm: crate.widthCm, heightCm: crate.heightCm, maxLoadKg: crate.maxLoadKg },
    { lengthCm: 120, widthCm: 80, heightCm: 100, maxLoadKg: 500 },
  );
});

test("buildDomesticCrate is plastic, fastened with bolts", () => {
  const crate = buildDomesticCrate(60, 40, 50, 150);
  assert.equal(crate.material, "plastic");
  assert.equal(crate.fastener, "bolts");
});

test("buildExportCrate rejects non-positive dimensions", () => {
  assert.throws(() => buildExportCrate(0, 80, 100, 500));
  assert.throws(() => buildExportCrate(120, -1, 100, 500));
});

test("buildDomesticCrate rejects a non-positive maxLoadKg", () => {
  assert.throws(() => buildDomesticCrate(60, 40, 50, 0));
});

test("a wood crate and a plastic crate never share a fastener", () => {
  const wood = buildExportCrate(100, 100, 100, 100);
  const plastic = buildDomesticCrate(100, 100, 100, 100);
  assert.notEqual(wood.fastener, plastic.fastener);
});
