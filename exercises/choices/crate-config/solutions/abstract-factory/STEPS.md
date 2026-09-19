# Steps — Abstract Factory

1. `CrateFamily`: one interface, `readonly material: Material` and `fastener(): Fastener`.
2. `WoodCrateFamily implements CrateFamily`: `material = "wood"`, `fastener()` returns
   `"nails"`.
3. `PlasticCrateFamily implements CrateFamily`: `material = "plastic"`, `fastener()` returns
   `"bolts"`.
4. `assembleCrate(family, ...)`: the shared validation and construction, reading
   `family.material` and `family.fastener()` instead of branching on material itself.
5. `buildExportCrate`/`buildDomesticCrate`: each `assembleCrate(new WoodCrateFamily() /
   new PlasticCrateFamily(), ...)` - one line, differing only in which family they hand over.
