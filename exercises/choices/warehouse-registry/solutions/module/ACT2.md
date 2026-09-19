# Act 2 — the measured part

Every number here comes from `./dp trade warehouse-registry`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A second, independent bin registry, live in the same process as the first: registering or
clearing bins in one must never affect the other. `createWarehouseRegistry(): 
WarehouseRegistryHandle` has to exist so a caller can build as many as it needs.

## What it cost on this route

`patches/module-act2.patch` (not the one that ships as `patches/solution-act2.patch` - see
below)

```
+0 new files   ·   2 existing files modified   ·   39 lines touched   ·   2 hunks
```

`registry.ts` gains one contiguous block: a `WarehouseRegistryHandle` interface and a
`createWarehouseRegistry()` factory closing over its own `ownBins` variable - one hunk, because
there's no class to interrupt it with. `index.ts` gains one export line, same as every other
route.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   38 lines touched   ·   2 hunks
```

One line cheaper than this route, and the same hunk count - because `src/`'s registry is built
exactly the same way this one is: a module-level array with no class to reuse. Neither route has
a reusable unit, so both pay the same "write a second implementation from scratch" price. The
one-line difference is naming noise (`ownBins` vs a different local name), not a structural
saving.

## What the winning route cost

`patches/solution-act2.patch` is `injection`'s patch - see
[`solutions/injection/ACT2.md`](../injection/ACT2.md) for the winning numbers (1 file, 3 lines,
1 hunk) and [`solutions/singleton/ACT2.md`](../singleton/ACT2.md) for the other losing route,
which at least had a class to reuse.

## What this route made worse

- **"Exactly one, for free" turned out to have no reusable unit behind it** - the module's whole
  appeal in act 1 is that there's no class, no constructor, no indirection; act 2 is exactly the
  moment that absence stops being free.
- **This route ties the no-pattern baseline** on lines touched - the module candidate and the
  naive baseline are, structurally, the same shape: one shared array, no way to get a second one
  without writing it from scratch.
