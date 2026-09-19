[🌐 English](./README.en.md)

# Act 2 — hazmat handling

Ravensgate's warehouse floor has a rule finance wants encoded: a shipment that is **both**
remote-area **and** oversize needs a hazmat-trained crew to load it, and that crew costs a
flat **3000 cent** surcharge on top of everything else.

- The new surcharge, `hazmatCents`, is `3000` when a shipment's `remoteAreaCents` **and**
  `oversizeCents` are both greater than zero, and `0` otherwise.
- It never applies on its own - it's a function of two *other* surcharges having already
  applied, not of the shipment's raw fields directly (though in this domain the two end up
  equivalent - a remote, oversize shipment is a remote, oversize shipment, however you check
  it).
- `SurchargeBreakdown` grows a `hazmatCents` field, and `totalCents` includes it.
- Every existing surcharge - fuel, remote-area, oversize - behaves exactly as act 1 left it.

## Done when (act 2)

- `./dp test surcharge-rules --act2 --solution <your-candidate>` is green.
- A shipment that is remote and oversize pays the extra 3000 cents; one that is only one of
  the two pays nothing extra.
- `totalCents` includes `hazmatCents`.
- `fuelCents`, `remoteAreaCents` and `oversizeCents` are unchanged from act 1 for every
  shipment.

## Then run `./dp trade surcharge-rules`
