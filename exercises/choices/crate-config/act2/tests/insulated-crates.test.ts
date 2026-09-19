import assert from "node:assert/strict";
import { test } from "node:test";

import { buildDomesticCrate, buildExportCrate } from "#exercise";

test("insulated defaults to false when omitted", () => {
  const crate = buildExportCrate(120, 80, 100, 500);
  assert.equal(crate.insulated, false);
});

test("an insulated export crate carries insulated: true", () => {
  const crate = buildExportCrate(120, 80, 100, 500, true);
  assert.equal(crate.insulated, true);
});

test("an insulated domestic crate carries insulated: true", () => {
  const crate = buildDomesticCrate(60, 40, 50, 500, true);
  assert.equal(crate.insulated, true);
});

test("an insulated export crate over 800kg is rejected", () => {
  assert.throws(() => buildExportCrate(120, 80, 100, 801, true));
});

test("an insulated domestic crate over 800kg is rejected", () => {
  assert.throws(() => buildDomesticCrate(60, 40, 50, 801, true));
});

test("an insulated crate at exactly 800kg is accepted", () => {
  const crate = buildExportCrate(120, 80, 100, 800, true);
  assert.equal(crate.maxLoadKg, 800);
});

test("an uninsulated crate over 800kg is unaffected by the cap", () => {
  const crate = buildExportCrate(120, 80, 100, 5000, false);
  assert.equal(crate.maxLoadKg, 5000);
});

test("an uninsulated crate over 800kg is unaffected even when insulated is omitted", () => {
  const crate = buildDomesticCrate(60, 40, 50, 5000);
  assert.equal(crate.maxLoadKg, 5000);
});

test("existing act 1 behaviour is unchanged: material and fastener still agree", () => {
  const wood = buildExportCrate(100, 100, 100, 100, true);
  const plastic = buildDomesticCrate(100, 100, 100, 100, true);
  assert.equal(wood.material, "wood");
  assert.equal(wood.fastener, "nails");
  assert.equal(plastic.material, "plastic");
  assert.equal(plastic.fastener, "bolts");
});
