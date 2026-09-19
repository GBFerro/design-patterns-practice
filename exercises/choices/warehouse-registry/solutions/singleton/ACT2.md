# Act 2 — the measured part

Every number here comes from `./dp trade warehouse-registry`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A second, independent bin registry, live in the same process as the first: registering or
clearing bins in one must never affect the other. `createWarehouseRegistry(): 
WarehouseRegistryHandle` has to exist so a caller can build as many as it needs.

## What it cost on this route

`patches/singleton-act2.patch` (not the one that ships as `patches/solution-act2.patch` - see
below)

```
+0 new files   ·   2 existing files modified   ·   32 lines touched   ·   3 hunks
```

`registry.ts` gains a `static createIndependent()` method (reusing the constructor from inside
the class), a `clear()` instance method, a `WarehouseRegistryHandle` interface, and a
`createWarehouseRegistry()` wrapper function that adapts a `WarehouseRegistry` instance to
that shape - two hunks, since the static method sits with the class and the wrapper sits after
it. `index.ts` gains one export line.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   38 lines touched   ·   2 hunks
```

More lines than this route, despite one fewer hunk: `src/`'s functions are hard-wired to one
shared module-level array with no class to reuse, so `createWarehouseRegistry()` there has to
hand-duplicate `registerBin`/`binLocation`/`binsInAisle`'s logic into a fresh closure from
scratch, all in one contiguous block.

## What the winning route cost

`patches/solution-act2.patch` is `injection`'s patch - see
[`solutions/injection/ACT2.md`](../injection/ACT2.md) for the winning numbers (1 file, 3 lines,
1 hunk) and [`solutions/module/ACT2.md`](../module/ACT2.md) for the other losing route.

## What this route made worse

- **A private constructor exists specifically to prevent what act 2 asks for** - satisfying it
  means writing code whose entire job is working around a guarantee this same class makes to
  everyone else.
- **Two new concepts (`clear()`, `createIndependent()`) had no reason to exist until act 2** -
  a reader of the act-1 class has no hint that either one is coming.
