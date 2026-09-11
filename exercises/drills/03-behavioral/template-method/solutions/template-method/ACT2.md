# Act 2 — the measured part, and the honest non-verdict

This exercise's `act2.axis` is `orthogonal`: act 2 arrives along an axis Template
Method does not protect, and the numbers below do not make the usual case for the
pattern. `./dp trade template-method` prints these same figures and does not score
them as a win or a loss — that is deliberate; read [HOW-TO-PRACTICE.md](../../../../../../docs/HOW-TO-PRACTICE.md)
on what an orthogonal exercise is for.

## What act 2 asked for

A fourth instrument, `guide-camera`, that must run connect → capture → download →
disconnect — **with no calibrate step at all**, not an empty or no-op one.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   2 existing files modified   ·   17 lines touched   ·   3 hunks
```

One new file (`instruments/guide-camera.ts`) plus two edits to the file this
pattern exists to protect: `calibrate` had to become optional on `InstrumentHooks`,
and `runPipeline` had to learn to skip the step — and the `calibrate`/`steps.push`
call — when the hook is absent. Registering the new instrument cost one more line
in `registry.ts`.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the three duplicated
act-1 functions:

```
+0 new files   ·   1 existing file modified   ·   25 lines touched   ·   2 hunks
```

A fourth copy-pasted function, omitting the two lines that push a calibrate step,
plus one new `case` in the switch. **Fewer files, fewer hunks — and yet more total
lines than the pattern route.** The reason is unglamorous: a duplicated function is
cheap to *add* and expensive to *be* (20 lines duplicated yet again), while the
pattern route is cheap to *extend* in general and expensive exactly here, because
here means editing the shared file.

Neither number tells a clean story, and that is the point of an orthogonal
exercise: **two honest measurements, and no single scalar that says which route
was right.** A reader who wants one should notice that wanting one is the mistake.

## What this route made worse

- **The interface got more permissive for everyone, to serve one instrument.**
  `calibrate` being optional is now true of `wideFieldCamera`, `spectrograph` and
  `thermalImager` too, even though none of them will ever omit it. A future typo —
  forgetting to implement `calibrate` on an instrument that needs it — is now a
  silent skip instead of a compile error.
- **`capture`'s `calibration` parameter is now `CalibrationLog | undefined`**
  everywhere, for the one instrument that does not produce one. Every existing
  hook has to either ignore the possibility of `undefined` (safe, because they
  know they always provide `calibrate`) or handle it defensively (which none of
  them do, and arguably should not have to).
- **The skeleton is no longer quite as "sealed" as the walkthrough's diagram
  claims.** A pattern whose entire value proposition is "the order never changes
  per instrument" had to grow its first piece of per-instrument variation in the
  order. One exception is not a crisis; a second one is worth stopping and asking
  whether the stage-list design named in the walkthrough should replace this.
