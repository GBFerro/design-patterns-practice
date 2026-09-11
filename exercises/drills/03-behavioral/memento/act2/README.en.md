[🌐 English](./README.en.md)

# Act 2 — a fifth field

`ExposureSetup` gains **`ditherPattern`** (`"none"`, `"spiral"`, or `"box"`
- defaults to `"none"`), set through a new `setDitherPattern` method. It
has to be part of the saved state exactly like the other four fields: a
save/undo cycle that changes `ditherPattern` and then undoes must restore
it, alongside everything else, from the same checkpoint.
