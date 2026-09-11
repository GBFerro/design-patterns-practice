# The route — policy objects behind a ranking interface

## When to choose this

When the thing that varies is **one decision inside an otherwise fixed procedure**, and you
expect more of them. Here the fixed procedure is the night — horizon, budget, start times,
skipped list — and the varying decision is the order candidates are offered in.

## What it costs

Five files where there was one, and one indirection between asking for a plan and getting
the ordering. Reading "what does `fair-share` do" is now one short file instead of one
branch of a long one, which is better; reading "what happens on a night, end to end" now
means opening two files instead of one, which is worse. You are buying the first at the
price of the second.

It also fixes the shape of a policy forever: a policy is *an ordering*. A future policy that
needs to see what is already scheduled — "never two spectroscopy targets in a row" — does
not fit this interface, and would need the packer to start asking the policy per step. That
is a real limit, not a hypothetical one.

## The moves

Run the suite after every row. It should never go red; if it does, undo and take a smaller
step.

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Name the night | Extract the horizon filter into `isAboveHorizon` and the entry construction into `toEntry`. Three call sites each, identical. | `refactor: name the two things every branch repeats` |
| 2 | Make the three passes identical | Rewrite the `max-science` loop as a `for…of` and inline the fair-share packing so all three branches read the same. No behaviour change — this is the step that *proves* they are the same night. | `refactor: make the three passes textually identical` |
| 3 | Split ordering from packing | In each branch, build the full ordered list first, then run one shared packing loop over it. The branches now differ only in how they build the list. | `refactor: separate ordering from packing in each branch` |
| 4 | Extract the packer | Lift the shared loop out of the `switch` into `pack`. The `switch` now only produces an ordering. | `refactor: extract pack` |
| 5 | Extract the orderings | One function per branch: `rankByDuration`, `rankByScienceValue`, `rankRoundRobin`. The `switch` returns one of three functions. | `refactor: extract one ranking function per policy` |
| 6 | Introduce the interface | `SchedulingPolicy` with `name` and `rank`. Wrap each function in an object that carries its own name. | `refactor: introduce SchedulingPolicy` |
| 7 | One file per policy | Move each policy into `policies/`. Pull the fair-share helpers (`groupByProposal`, `interleave`) along with it — they belong to that policy and nothing else. | `refactor: one file per policy` |
| 8 | Replace the switch with a lookup | `policies/registry.ts` holds the collection, `findPolicy` looks up by name, `policyNames` derives the list. Delete the `KNOWN_POLICIES` constant and the hardcoded list in the error message. | `refactor: replace the policy switch with a registry` |
| 9 | Shrink the entry point | `planNight` is now four lines: find the policy, filter the horizon, rank, pack. | `refactor: reduce planNight to its four steps` |

Step 8 is the one that matters most and the one people skip. Stopping at step 7 leaves a
`switch` that maps strings to objects — tidier, but still a place you must edit, and still
three lists of names that can drift apart.

## Then

```bash
./dp act2 strategy
```

The act-2 requirement and what each route cost are in [ACT2.md](./ACT2.md). The reasoning
behind every step above, including the two decisions I am not sure about, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
