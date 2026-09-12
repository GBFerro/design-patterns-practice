import assert from "node:assert/strict";
import { test } from "node:test";

import { cloneTemplate } from "#exercise";

test("cloning rush-banner carries its cmyk color mode through", () => {
  const clone = cloneTemplate("rush-banner");
  assert.equal(clone.colorMode, "cmyk");
});

test("cloning letterhead-standard carries its spot color mode through", () => {
  const clone = cloneTemplate("letterhead-standard");
  assert.equal(clone.colorMode, "spot");
});
