# Act 2 — the measured part

Every number here comes from `./dp trade label-pipeline`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A new section - "SIGNATURE REQUIRED" - conditional on `weightKg > 20`, and positioned
differently by destination: right after the address, before the weight, for domestic
shipments; as the very last line, after customs, for international ones. Every other section's
content and order stays exactly as act 1 left it, for both `buildLabel` and
`buildManifestEntry`.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   2 existing files modified   ·   23 lines touched   ·   2 hunks
```

`stages.ts` gains one new `Stage` value, `signatureRequired` (four lines, including its
threshold constant). `label-content.ts`'s `sections()` changes from a fixed array literal to
one built with two conditional `.push()` calls - the domestic case pushes `signatureRequired`
right after `address`; the international case pushes it after everything else. **Neither
`buildLabel` nor `buildManifestEntry` changed at all** - both still just call `sections()` and
join its result.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   1 existing file modified   ·   24 lines touched   ·   3 hunks
```

Fewer files than this route - `src/` only ever had one - but more lines and more hunks,
because the same two conditions (`requiresSignature && isDomestic`,
`requiresSignature && !isDomestic`) had to be written out **twice**, once inside `buildLabel`
and once inside `buildManifestEntry`, since act 1 never gave those two functions anything to
share.

## What the other two candidates cost

Neither of these patches ships in `patches/` under the name `./dp trade` looks for - only one
solution can be `absorbsAct2`. They're measured the same way, kept as `decorator-act2.patch`
and `template-method-act2.patch` for anyone who wants to reproduce the numbers:

```
decorator          +0 new files · 2 existing files modified · 41 lines touched · 4 hunks
template-method     +0 new files · 1 existing file modified · 23 lines touched · 3 hunks
```

Decorator is the most expensive of all four measured routes - its base renderer had to be
split into two pieces just to open a seam before the weight line, and its composition function
ended up building two different chains instead of one. Template Method ties this route on
lines but needs one more hunk, all three inside the single shared base class its own pattern
says should be the most stable file in the exercise. See
[`solutions/decorator/ACT2.md`](../decorator/ACT2.md) and
[`solutions/template-method/ACT2.md`](../template-method/ACT2.md) for the detail.

## What this route made worse

- **Nothing type-checks that `stages` is complete.** A stage list that's missing a section, or
  lists one twice, compiles fine - the same gap named in
  [`WALKTHROUGH.md`](./WALKTHROUGH.md), and act 2 didn't close it, since the two conditional
  pushes are just as easy to get wrong as the fixed array was easy to get right by
  construction.
- **`sections()` now reads its own control flow to find the order**, instead of the order
  being visible as one flat array literal. A reader has to run the two `if`s in their head to
  know where `signatureRequired` lands for a given shipment - a small cost, and the same one
  the no-pattern baseline pays for the identical reason.
