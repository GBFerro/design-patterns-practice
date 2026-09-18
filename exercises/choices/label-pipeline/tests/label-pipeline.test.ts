import assert from "node:assert/strict";
import { test } from "node:test";

import { buildLabel, buildManifestEntry } from "#exercise";
import type { Shipment } from "#exercise";

const base: Shipment = {
  orderId: "A100",
  address: "123 Elm St, Springfield, IL 62704",
  weightKg: 5,
  destinationCountry: "US",
  fragile: false,
  hazmat: false,
};

test("a plain domestic label gets header, address and weight, nothing else", () => {
  assert.equal(buildLabel(base), "RG-A100\n123 Elm St, Springfield, IL 62704\n5 kg");
});

test("a fragile label adds one warning line after the weight", () => {
  const label = buildLabel({ ...base, fragile: true });
  assert.equal(label, "RG-A100\n123 Elm St, Springfield, IL 62704\n5 kg\nHANDLE WITH CARE - FRAGILE");
});

test("a hazmat label adds one warning line after the weight", () => {
  const label = buildLabel({ ...base, hazmat: true });
  assert.equal(label, "RG-A100\n123 Elm St, Springfield, IL 62704\n5 kg\nHAZARDOUS MATERIALS - SEE MSDS");
});

test("fragile and hazmat both present, in that order", () => {
  const label = buildLabel({ ...base, fragile: true, hazmat: true });
  assert.equal(
    label,
    "RG-A100\n123 Elm St, Springfield, IL 62704\n5 kg\nHANDLE WITH CARE - FRAGILE\nHAZARDOUS MATERIALS - SEE MSDS",
  );
});

test("an international label adds a customs line, last", () => {
  const label = buildLabel({ ...base, destinationCountry: "CA" });
  assert.equal(label, "RG-A100\n123 Elm St, Springfield, IL 62704\n5 kg\nCUSTOMS: contents declared, origin US");
});

test("international, fragile and hazmat: customs always comes after the warnings", () => {
  const label = buildLabel({ ...base, destinationCountry: "CA", fragile: true, hazmat: true });
  assert.equal(
    label,
    "RG-A100\n123 Elm St, Springfield, IL 62704\n5 kg\n" +
      "HANDLE WITH CARE - FRAGILE\nHAZARDOUS MATERIALS - SEE MSDS\nCUSTOMS: contents declared, origin US",
  );
});

test("the manifest entry carries the same sections, joined by ' | ' instead of newlines", () => {
  const entry = buildManifestEntry({ ...base, fragile: true, destinationCountry: "CA" });
  assert.equal(
    entry,
    "RG-A100 | 123 Elm St, Springfield, IL 62704 | 5 kg | HANDLE WITH CARE - FRAGILE | CUSTOMS: contents declared, origin US",
  );
});

test("the manifest entry for a plain domestic shipment has just three parts", () => {
  assert.equal(buildManifestEntry(base), "RG-A100 | 123 Elm St, Springfield, IL 62704 | 5 kg");
});

test("buildLabel and buildManifestEntry agree on which optional sections apply", () => {
  const shipment: Shipment = { ...base, hazmat: true, destinationCountry: "MX" };
  const label = buildLabel(shipment);
  const entry = buildManifestEntry(shipment);
  assert.equal(label.split("\n").length, entry.split(" | ").length);
});
