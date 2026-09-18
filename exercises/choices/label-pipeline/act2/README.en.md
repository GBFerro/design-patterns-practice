[🌐 English](./README.en.md)

# Act 2 — signature required

Ravensgate's couriers need a "SIGNATURE REQUIRED" line on the label for any shipment over
**20 kg** — heavy enough that a courier leaving it unattended is a real risk. But *where* that
line goes depends on the shipment:

- **Domestic** (`destinationCountry === "US"`) — right after the address block, **before** the
  weight line. A domestic courier scans the label top to bottom and needs to see the
  requirement before they've even weighed the package in hand.
- **International** — as the very **last** line, after the customs declaration. Customs review
  happens first; the courier-facing notice comes after everything customs needs to see.

Every other line's content and order is unchanged from act 1.

## Done when (act 2)

- `./dp test label-pipeline --act2 --solution <your-candidate>` is green.
- A shipment at or under 20 kg gets no signature line at all, domestic or international.
- A shipment over 20 kg gets exactly one "SIGNATURE REQUIRED" line, in the position above -
  never both, never neither.

## Then run `./dp trade label-pipeline`
