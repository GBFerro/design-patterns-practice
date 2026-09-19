# Steps — A module

1. `let bins: BinLocation[] = []` at module scope, initialised eagerly - no
   lazy-build check, because a module only ever loads once.
2. `registerBin`/`binLocation`/`binsInAisle`: plain functions, reading and
   writing `bins` directly - no class, no instance, nothing to call
   `getInstance()` on.
3. `resetRegistry()`: reassigns `bins = []` - the same escape hatch every
   other candidate needs, for the same reason.
