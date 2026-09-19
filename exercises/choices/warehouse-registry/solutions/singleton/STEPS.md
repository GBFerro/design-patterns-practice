# Steps — Singleton

1. `WarehouseRegistry`: one class, a private `bins: BinLocation[]` field, a **private**
   constructor - `getInstance()` is the only way in.
2. `static getInstance()`: lazily builds the one instance on first call, returns the same one
   after that.
3. `static resetForTests()`: nulls the cached instance out, so tests can start clean - the
   escape hatch a singleton needs to be testable at all.
4. `registerBin`/`binLocation`/`binsInAisle`: instance methods, reading and writing `this.bins`.
5. The four frozen free functions each call `WarehouseRegistry.getInstance()` and delegate.
