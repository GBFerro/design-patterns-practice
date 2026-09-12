# Act 2 — the measured part

Every number here comes from `./dp trade prototype`, which applies the
two patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A new field on `JobTemplate`, `colorMode: "cmyk" | "spot"`, with a real
value for each of the two existing templates - `rush-banner` is
`"cmyk"`, `letterhead-standard` is `"spot"` - and a clone of either must
carry it through.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   2 existing files modified   ·   4 lines touched   ·   4 hunks
```

`types.ts` gains the `ColorMode` type and one `JobTemplate` field.
`templates.ts` gains one line per existing template, giving each its
real value. **`clone.ts` does not appear in this patch at all** -
`structuredClone` copies `colorMode` the moment it exists on the object,
with no line of code anywhere that needed to learn the field's name.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the manual
field-by-field copy in `src/`:

```
+0 new files   ·   3 existing files modified   ·   5 lines touched   ·   5 hunks
```

Every dimension moves against the baseline: one more file (`clone.ts`
joins `types.ts` and `templates.ts`), one more line, one more hunk. The
extra file is not incidental - it is `cloneTemplate` itself, which has
to learn the new field's name (`colorMode: template.colorMode,`) or
silently return an object one field short of what `JobTemplate` now
requires. TypeScript's own structural check on the function's explicit
return type is what turns "forgot to update the clone" from a runtime
bug into a compile error here - which is exactly the discipline the
pattern route needed zero code to get.

## What this route made worse

- **Cloning is now opaque.** There is no line in `solutions/prototype/`
  that says what a clone contains - which is exactly why nothing needed
  to change here, and exactly the same reason a field that should NOT be
  deep-copied (an identity, an open handle) would be copied anyway, with
  nothing in this file positioned to stop it. See WALKTHROUGH.md's "What
  it cost."
