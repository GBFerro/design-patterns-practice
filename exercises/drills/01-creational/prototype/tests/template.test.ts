import assert from "node:assert/strict";
import { test } from "node:test";

import { cloneTemplate } from "#exercise";

test("cloning a template carries every field through unchanged", () => {
  const clone = cloneTemplate("rush-banner");
  assert.equal(clone.name, "Rush banner");
  assert.equal(clone.jobKind, "banner");
  assert.equal(clone.basePrice, 45);
  assert.equal(clone.defaultQuantity, 1);
  assert.deepEqual(clone.finishingOptions, ["grommets", "waterproof-coating"]);
});

test("cloning a different template returns that template's own fields", () => {
  const clone = cloneTemplate("letterhead-standard");
  assert.equal(clone.name, "Standard letterhead");
  assert.equal(clone.jobKind, "brochure");
});

test("two clones of the same template are two different objects", () => {
  const first = cloneTemplate("rush-banner");
  const second = cloneTemplate("rush-banner");
  assert.notEqual(first, second);
});

test(
  "editing a clone's finishing options does not change a later clone of the same template " +
    "- regression, this array used to be shared instead of copied",
  () => {
    const first = cloneTemplate("rush-banner");
    first.finishingOptions.push("foil-stamp");

    const second = cloneTemplate("rush-banner");
    assert.deepEqual(second.finishingOptions, ["grommets", "waterproof-coating"]);
  },
);

test("editing one template's clone does not reach across into a different template's clone", () => {
  const banner = cloneTemplate("rush-banner");
  banner.finishingOptions.length = 0;

  const letterhead = cloneTemplate("letterhead-standard");
  assert.deepEqual(letterhead.finishingOptions, ["watermark"]);
});
