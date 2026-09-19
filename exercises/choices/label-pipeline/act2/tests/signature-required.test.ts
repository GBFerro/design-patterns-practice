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

test("a heavy domestic label gets SIGNATURE REQUIRED between the address and the weight", () => {
  const label = buildLabel({ ...base, weightKg: 25 });
  assert.equal(
    label,
    "RG-A100\n123 Elm St, Springfield, IL 62704\nSIGNATURE REQUIRED\n25 kg",
  );
});

test("a light domestic label gets no signature line at all", () => {
  const label = buildLabel({ ...base, weightKg: 15 });
  assert.equal(label, "RG-A100\n123 Elm St, Springfield, IL 62704\n15 kg");
});

test("exactly 20 kg is not over the threshold - no signature line", () => {
  const label = buildLabel({ ...base, weightKg: 20 });
  assert.equal(label, "RG-A100\n123 Elm St, Springfield, IL 62704\n20 kg");
});

test("a heavy, fragile domestic label: signature before weight, warning after", () => {
  const label = buildLabel({ ...base, weightKg: 25, fragile: true });
  assert.equal(
    label,
    "RG-A100\n123 Elm St, Springfield, IL 62704\nSIGNATURE REQUIRED\n25 kg\nHANDLE WITH CARE - FRAGILE",
  );
});

test("a heavy international label gets SIGNATURE REQUIRED last, after customs", () => {
  const label = buildLabel({ ...base, weightKg: 30, destinationCountry: "CA" });
  assert.equal(
    label,
    "RG-A100\n123 Elm St, Springfield, IL 62704\n30 kg\nCUSTOMS: contents declared, origin US\nSIGNATURE REQUIRED",
  );
});

test("a light international label keeps customs as the last line - no signature", () => {
  const label = buildLabel({ ...base, weightKg: 10, destinationCountry: "CA" });
  assert.equal(
    label,
    "RG-A100\n123 Elm St, Springfield, IL 62704\n10 kg\nCUSTOMS: contents declared, origin US",
  );
});

test("a heavy, fragile, hazmat international label: signature is still the very last line", () => {
  const label = buildLabel({
    ...base,
    weightKg: 25,
    destinationCountry: "CA",
    fragile: true,
    hazmat: true,
  });
  assert.equal(
    label,
    "RG-A100\n123 Elm St, Springfield, IL 62704\n25 kg\n" +
      "HANDLE WITH CARE - FRAGILE\nHAZARDOUS MATERIALS - SEE MSDS\n" +
      "CUSTOMS: contents declared, origin US\nSIGNATURE REQUIRED",
  );
});

test("the manifest entry gets the same signature rule, joined by ' | ' instead", () => {
  const entry = buildManifestEntry({ ...base, weightKg: 25 });
  assert.equal(
    entry,
    "RG-A100 | 123 Elm St, Springfield, IL 62704 | SIGNATURE REQUIRED | 25 kg",
  );
});

test("buildLabel and buildManifestEntry still agree on section count once signature is in play", () => {
  const shipment: Shipment = {
    ...base,
    weightKg: 30,
    destinationCountry: "MX",
    hazmat: true,
  };
  const label = buildLabel(shipment);
  const entry = buildManifestEntry(shipment);
  assert.equal(label.split("\n").length, entry.split(" | ").length);
});
