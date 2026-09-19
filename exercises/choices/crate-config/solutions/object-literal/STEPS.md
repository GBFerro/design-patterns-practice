# Steps — an object literal

1. `FASTENER_BY_MATERIAL`: one `Record<Material, Fastener>` literal -
   `{ wood: "nails", plastic: "bolts" }`.
2. `assembleCrate(material, ...)`: the shared validation and construction, reading
   `FASTENER_BY_MATERIAL[material]` instead of branching or dispatching to an object.
3. `buildExportCrate`/`buildDomesticCrate`: each `assembleCrate("wood" / "plastic", ...)` -
   one line, differing only in which material they pass.
