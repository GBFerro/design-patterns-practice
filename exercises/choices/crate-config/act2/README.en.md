[🌐 English](./README.en.md)

# Act 2 — insulated crates

Some shipments - export and domestic alike - are going somewhere cold, and need an
**insulated** crate: thicker walls, built the same way otherwise.

- Both `buildExportCrate` and `buildDomesticCrate` grow a fifth, optional parameter:
  `insulated` (default `false`).
- The resulting `CrateSpec` carries that choice as a new field, `insulated: boolean`.
- The thicker walls eat into the crate's safe capacity: **an insulated crate's `maxLoadKg`
  may not exceed 800** - building one that asks for more must be rejected, wood or plastic,
  export or domestic alike.
- A crate built without `insulated` (or with it explicitly `false`) is unaffected by the new
  rule, however high its `maxLoadKg` - every existing act 1 behaviour stays exactly as it was.

## Done when (act 2)

- `./dp test crate-config --act2 --solution <your-candidate>` is green.
- `insulated` defaults to `false` and is carried through onto the resulting `CrateSpec`
  unchanged.
- An insulated crate over 800kg is rejected, regardless of material.
- An uninsulated crate is never subject to the 800kg cap, however high `maxLoadKg` goes.

## Then run `./dp trade crate-config`
