[🌐 English](./README.en.md)

# Act 2 — tanager adds a small-parcel exception

Tanager, previously local/regional only, has signed a new small-parcel arrangement:
shipments to the `"national"` zone are now eligible too, but only when they weigh 12kg or
less. Every other rule tanager already follows - the 25kg cap that still applies overall,
its zero negotiated discount - stays exactly as it is.

Nothing changes for ravenex or skyfreight.

## Done when (act 2)

- `./dp test kata-02 --act2 --solution <your-route>` is green.
- A national shipment of 12kg or less is now eligible for tanager.
- A national shipment heavier than 12kg is still ineligible for tanager.
- Tanager's local and regional eligibility, and its 25kg overall cap, are unchanged.
- Ravenex and skyfreight behave exactly as they do today.

## Then run `./dp trade kata-02`
