# The route — one FareReader implementation, adapters for the rest

## When to choose this

When the "real" logic (here, the fare rule) is written once against an
interface you control, and other interfaces you do *not* control need to
join in without duplicating that logic or changing their own shape.
Reach for an adapter class per incompatible shape, not a branch inside
the one true function.

## What it costs

Every reader shape that isn't already `FareReader` needs its own small
class, whose entire job is translation - not admission logic. A reader
tracing "how is a legacy passenger admitted" now opens two files instead
of one: `legacy-reader-adapter.ts` for the translation, `admit.ts` for
the rule.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `LegacyReaderAdapter` | Implements `FareReader`, wrapping a `LegacyCardScanner`; `readFare()` converts dollars to cents and `"no-card"` to `null`. | `refactor: introduce LegacyReaderAdapter` |
| 2 | Route `admitLegacyPassenger` through it | Delete its own copy of the fare rule; construct the adapter and call `admitPassenger`. | `refactor: route admitLegacyPassenger through the adapter` |

Step 1 is checked against the act-1 suite by writing a small scratch
call before touching `admit.ts` at all - the adapter is proven correct
in isolation before anything depends on it. Step 2 is the only place
`admit.ts` changes, and it changes by deletion: the second copy of the
fare rule disappears, replaced by one call.

## Then

```bash
./dp act2 adapter
```

What a third reader shape costs on this route, and what it would have
cost without the pattern, is in [ACT2.md](./ACT2.md). The full
reasoning, with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
