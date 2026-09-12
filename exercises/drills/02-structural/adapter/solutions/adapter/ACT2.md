# Act 2 — the measured part

Every number here comes from `./dp trade adapter`, which applies the two
patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A third reader shape, a contactless pilot at one station:
`ContactlessReader { poll(): string | undefined }`, returning `undefined`
for no card, or a raw `"cardId,balanceCents"` string when a card is
presented. A new entry point, `admitContactlessPassenger`, applying the
identical fare rule.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   3 existing files modified   ·   17 lines touched   ·   4 hunks
```

The new file is `contactless-reader-adapter.ts` - the translation, and
nothing else. Of the three existing files touched, two carry overhead
every reader shape pays regardless of route: `types.ts` gains the
`ContactlessReader` interface, `index.ts` gains one export line each for
the type and the function. The one line that matters is in `admit.ts`:

```ts
export function admitContactlessPassenger(reader: ContactlessReader): AdmissionResult {
  return admitPassenger(new ContactlessReaderAdapter(reader));
}
```

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   3 existing files modified   ·   27 lines touched   ·   4 hunks
```

Files and hunks tie - both routes pay the same `types.ts`/`index.ts`
overhead for a brand-new reader shape, and that overhead swamps any
difference at that level. Lines touched is where this resolves: 17
against 27, entirely because of what lands in `admit.ts`. The pattern
route's addition there is the one-line delegate above; the baseline's is
a third full copy of the fare rule, parsing the wire string inline -
comparable in size to the legacy branch it sits next to, because it *is*
the legacy branch's logic, retyped a third time.

## What this route made worse

- **A third small file to open** for a rule that, on the baseline route,
  would have been readable in one place (however duplicated). Confirming
  that all three routes apply the same fare logic now means trusting
  that `admitPassenger` is the only place that logic lives, rather than
  reading three functions side by side.
- **The adapter has to get the wire format right with no schema behind
  it.** `"CARD-777,1000".split(",")` trusts the pilot reader's raw string
  completely; a malformed poll (an extra comma, a missing balance)
  produces `NaN`, not a caught error - exactly the kind of translation
  bug an adapter is supposed to be the one place responsible for
  catching, and this one does not.
