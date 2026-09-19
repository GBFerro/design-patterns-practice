[🌐 English](./README.en.md)

# Act 2 — a second site, live at the same time as the first

Ravensgate is opening a second fulfilment site - its own bins, its own aisles, running **at
the same time** as the existing site's registry, in the same process.

The suite needs both registries live in the same test run: registering a bin in one must not
affect the other, and looking a bin up in one must never find something only the other one
knows about.

Export `createWarehouseRegistry(): WarehouseRegistryHandle` so a caller can build as many
independent registries as it needs, each with its own `registerBin`, `binLocation`,
`binsInAisle` and `clear`.

## Done when (act 2)

- `./dp test warehouse-registry --act2 --solution <your-candidate>` is green.
- Two registries built from `createWarehouseRegistry()` never see each other's bins.
- Registering a bin in one registry does not change what the other one reports for
  `binLocation` or `binsInAisle`.
- `clear()` on one registry does not affect the other.

## Then run `./dp trade warehouse-registry`
