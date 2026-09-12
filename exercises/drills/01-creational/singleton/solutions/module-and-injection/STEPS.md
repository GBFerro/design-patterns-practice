# The route — an explicit createPressRoom(settings) factory, no shared instance

## When to choose this

Whenever you are about to write `let instance` and a lazy-init check.
There is no configuration this repo has found where a hidden shared
mutable module-level variable was the *only* way to get "one well-known
default" - a default built once and bound to a name does the same job
without making a second one structurally impossible.

## What it costs

There is no longer a single, well-known place every part of the app is
guaranteed to agree with. Two press rooms built from two different
settings will happily disagree - by design - and nothing stops a caller
from building an unwanted second one by accident, the way a `new
PressRoom()` typo would in a language with no `private constructor`.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Introduce `createPressRoom(settings)` | One factory, returning an object with the five methods, each closed over `settings` instead of a shared getter. | `refactor: introduce createPressRoom` |
| 2 | Delete the five separate consumer files | `rush-quote.ts`, `daily-capacity.ts`, `intake-gate.ts`, `status-report.ts`, `maintenance-admin.ts` - their logic now lives inside `createPressRoom`. | `refactor: fold the five consumers into createPressRoom` |
| 3 | Build the default press room | `const mainFloor = createPressRoom(loadDefaultSettings());` - one call, no different from any other. | `refactor: build mainFloor from createPressRoom` |
| 4 | Rebind the five frozen names | `index.ts` exports `rushQuoteTotal = mainFloor.rushQuoteTotal`, and so on - same names, same signatures, same call sites. | `refactor: rebind the frozen exports to mainFloor` |

Step 1 is checked in isolation (a unit test constructing two rooms by
hand) before step 2 deletes anything - so the old and new implementations
briefly coexist, and the suite stays green against the old five files
until the moment they are deleted.

## Then

```bash
./dp act2 singleton
```

What "two configurations live in the same run" costs on this route, and
what it would have cost without the pattern, is in [ACT2.md](./ACT2.md).
The full reasoning, including the DESIGN.md §9.2 paragraph this
`avoid`-verdict drill owes you, is in [WALKTHROUGH.md](./WALKTHROUGH.md).
