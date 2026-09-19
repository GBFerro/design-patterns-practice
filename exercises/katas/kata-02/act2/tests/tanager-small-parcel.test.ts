import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { pickCheapestCarrier, pickCheapestForBatch } from "#exercise";
import type { CarrierQuote, ShipmentRequest } from "#exercise";

function request(overrides: Partial<ShipmentRequest> = {}): ShipmentRequest {
  return {
    shipmentId: "S-1",
    destinationZone: "national",
    weightKg: 10,
    requiredSpeedTier: "standard",
    ...overrides,
  };
}

function quote(overrides: Partial<CarrierQuote> = {}): CarrierQuote {
  return { carrierId: "tanager", baseCents: 1000, speedTier: "standard", ...overrides };
}

describe("tanager's national small-parcel exception", () => {
  it("makes tanager eligible for a national shipment at 12kg or less", () => {
    const decision = pickCheapestCarrier(request({ weightKg: 12 }), [quote()]);
    assert.equal(decision.winningCarrierId, "tanager");
  });

  it("still refuses a national shipment heavier than 12kg", () => {
    assert.throws(() => pickCheapestCarrier(request({ weightKg: 13 }), [quote()]));
  });

  it("leaves tanager's local eligibility unchanged", () => {
    const decision = pickCheapestCarrier(
      request({ destinationZone: "local", weightKg: 20 }),
      [quote()],
    );
    assert.equal(decision.winningCarrierId, "tanager");
  });

  it("leaves tanager's overall 25kg cap unchanged, even for a small-parcel-eligible zone", () => {
    // 12kg is within the new national exception's own limit, so this exercises the general
    // cap on a zone the small-parcel exception doesn't touch at all.
    assert.throws(() =>
      pickCheapestCarrier(request({ destinationZone: "regional", weightKg: 30 }), [
        quote(),
      ]),
    );
  });

  it("does not change ravenex's or skyfreight's eligibility", () => {
    const decision = pickCheapestCarrier(request({ weightKg: 30 }), [
      quote({ carrierId: "ravenex", baseCents: 5000 }),
      quote({ carrierId: "skyfreight", baseCents: 6000 }),
    ]);
    assert.equal(decision.winningCarrierId, "ravenex");
  });

  it("applies inside a bulk batch too", () => {
    const [decision] = pickCheapestForBatch(
      [request({ shipmentId: "S-1", weightKg: 12 })],
      new Map([["S-1", [quote()]]]),
    );
    assert.equal(decision?.winningCarrierId, "tanager");
  });
});
