import assert from "node:assert/strict";
import { test } from "node:test";

import { quoteSurcharges, totalSurchargeCents } from "#exercise";
import type { Shipment } from "#exercise";

const metroSmall: Shipment = {
  baseRateCents: 10_000,
  destination: "metro",
  lengthCm: 40,
  widthCm: 30,
  heightCm: 20,
};

const remoteOnly: Shipment = {
  baseRateCents: 10_000,
  destination: "remote",
  lengthCm: 40,
  widthCm: 30,
  heightCm: 20,
};

const remoteOversize: Shipment = {
  baseRateCents: 10_000,
  destination: "remote",
  lengthCm: 200,
  widthCm: 30,
  heightCm: 20,
};

test("fuel surcharge is 12% of the base rate, rounded", () => {
  const quote = quoteSurcharges({ ...metroSmall, baseRateCents: 9_999 });
  assert.equal(quote.fuelCents, Math.round(9_999 * 0.12));
});

test("a metro shipment pays no remote-area surcharge", () => {
  const quote = quoteSurcharges(metroSmall);
  assert.equal(quote.remoteAreaCents, 0);
});

test("a remote shipment pays a flat remote-area surcharge", () => {
  const quote = quoteSurcharges({ ...metroSmall, destination: "remote" });
  assert.equal(quote.remoteAreaCents, 1500);
});

test("a shipment under every dimension threshold pays no oversize surcharge", () => {
  const quote = quoteSurcharges(metroSmall);
  assert.equal(quote.oversizeCents, 0);
});

test("a shipment over the threshold on any one dimension pays the flat oversize surcharge", () => {
  const quote = quoteSurcharges({ ...metroSmall, lengthCm: 151 });
  assert.equal(quote.oversizeCents, 2000);
});

test("totalCents is the sum of fuel, remote-area and oversize for a shipment that triggers only those", () => {
  const quote = quoteSurcharges(remoteOnly);
  assert.equal(
    quote.totalCents,
    quote.fuelCents + quote.remoteAreaCents + quote.oversizeCents,
  );
});

test("totalSurchargeCents agrees with quoteSurcharges's totalCents for the same shipment", () => {
  assert.equal(
    totalSurchargeCents(remoteOversize),
    quoteSurcharges(remoteOversize).totalCents,
  );
  assert.equal(totalSurchargeCents(metroSmall), quoteSurcharges(metroSmall).totalCents);
});
