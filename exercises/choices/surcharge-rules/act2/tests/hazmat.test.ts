import assert from "node:assert/strict";
import { test } from "node:test";

import { quoteSurcharges } from "#exercise";
import type { Shipment } from "#exercise";

const metroSmall: Shipment = {
  baseRateCents: 10_000,
  destination: "metro",
  lengthCm: 40,
  widthCm: 30,
  heightCm: 20,
};

test("a remote, oversize shipment pays the hazmat surcharge", () => {
  const quote = quoteSurcharges({ ...metroSmall, destination: "remote", lengthCm: 200 });
  assert.equal(quote.hazmatCents, 3000);
});

test("a remote shipment that isn't oversize pays no hazmat surcharge", () => {
  const quote = quoteSurcharges({ ...metroSmall, destination: "remote" });
  assert.equal(quote.hazmatCents, 0);
});

test("an oversize shipment that isn't remote pays no hazmat surcharge", () => {
  const quote = quoteSurcharges({ ...metroSmall, lengthCm: 200 });
  assert.equal(quote.hazmatCents, 0);
});

test("a metro, small shipment pays no hazmat surcharge", () => {
  const quote = quoteSurcharges(metroSmall);
  assert.equal(quote.hazmatCents, 0);
});

test("totalCents includes the hazmat surcharge", () => {
  const shipment: Shipment = { ...metroSmall, destination: "remote", lengthCm: 200 };
  const quote = quoteSurcharges(shipment);
  assert.equal(
    quote.totalCents,
    quote.fuelCents + quote.remoteAreaCents + quote.oversizeCents + quote.hazmatCents,
  );
});

test("existing surcharges are unchanged: fuel, remote-area and oversize compute as they did in act 1", () => {
  const shipment: Shipment = { ...metroSmall, destination: "remote", lengthCm: 200 };
  const quote = quoteSurcharges(shipment);
  assert.equal(quote.fuelCents, Math.round(10_000 * 0.12));
  assert.equal(quote.remoteAreaCents, 1500);
  assert.equal(quote.oversizeCents, 2000);
});
