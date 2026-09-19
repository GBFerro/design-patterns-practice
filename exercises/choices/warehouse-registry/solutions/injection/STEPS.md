# Steps — Injection

1. `WarehouseRegistryHandle`: an interface listing the four operations a
   registry supports - `registerBin`, `binLocation`, `binsInAisle`, `clear`.
2. `createWarehouseRegistry()`: builds one independent registry - a
   closure-scoped `bins` array, and an object literal whose methods close
   over it. Calling this twice gives two registries that share nothing.
3. `const mainSite = createWarehouseRegistry()`: the one registry the rest
   of the app uses by default, built exactly the same way any other
   registry would be - no special-cased "the" instance.
4. The four frozen exports are bound directly to `mainSite`'s methods:
   `registerBin = mainSite.registerBin`, and so on; `resetRegistry =
   mainSite.clear`.
