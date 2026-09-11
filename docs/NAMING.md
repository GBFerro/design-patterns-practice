# Naming

Inherited from `refactoring-practice`, with one section added for this repository: the GoF
role names.

Fowler's catalogue treats a name as a **move** — *Rename Variable*, *Mysterious Name* — not
as a judgement. It teaches you to rename safely; it does not teach you to tell a good name
from a plausible one. That gap matters more here than it does there, because half of what a
pattern buys is that the structure *says what it is*.

## The four questions, in order

### 1. Does it say *what*, or *how*?

`rankByDuration` says how. `maxTargets` says what the caller wanted. Prefer the what; the how
is visible in the body and changes more often than the intent.

### 2. Could it name something else in this file?

If yes, it is not a name, it is a category. `schedule` inside a scheduling module names
everything and therefore nothing. Pick the word the domain is not already using.

### 3. Does it read well at the call site?

`if (isAboveHorizon(request))` reads. `if (checkHorizon(request))` does not say what true
means. Write the call site first if you have to.

### 4. Is it **true**?

The one that produces real findings, and the one no tool can answer. `isObservable` is false
if the function only checks altitude. A name that promises more than the code delivers is
worse than a vague one, because the next person will believe it.

## The repo's conventions

- `format*` takes a value and returns a string. `render*` takes domain objects and returns
  lines. They are not interchangeable.
- `find*` returns a thing or throws. `*OrUndefined` may return nothing. No `get*` that
  sometimes fails.
- A collection of things is a plural noun (`policies`), not `policyList` or `policyMap`.

## Naming GoF roles

The book's role names — `Context`, `Strategy`, `ConcreteStrategyA`, `Originator`, `Caretaker`,
`Handler`, `Receiver` — are **vocabulary for talking about the pattern**, not names for your
classes. Used literally, they produce `StrategyContext` and `ConcreteStrategyImpl`, which tell
a reader which diagram you copied and nothing about the program.

The rule: **name the role from the domain, and let the walkthrough do the mapping.**

| Book role | A bad name | A name that says something |
| --- | --- | --- |
| `Strategy` | `SchedulingStrategy` | `SchedulingPolicy` — "policy" is the word the observatory actually uses |
| `ConcreteStrategy` | `MaxTargetsStrategy` | `maxTargets` — the suffix repeats the interface |
| `Context` | `StrategyContext` | `planner`, or no object at all |
| `Handler` | `AbstractHandler` | `ValidationRule` |
| `Originator` / `Caretaker` | `ExposureOriginator` | `ExposureSetup` / `SetupHistory` |

Two exceptions, both narrow:

1. **When the domain has no word for it**, the book's word is better than inventing one. A
   generic `Command` in a system whose domain says "command" is right.
2. **In the walkthrough**, always use both: the role name and yours, side by side. That
   mapping is the bridge to the book, and leaving it out is why the book is hard to read.

`./dp names <id>` is planned as an advisory pass for vague names (`data`, `temp`, `*Manager`,
`*Impl`, `*Helper`). It cannot detect a name that is *false* — question 4 — which is why that
one is a criterion of the review and not of the lint.
