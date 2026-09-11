[🌐 English](./README.en.md)

# Chain of Responsibility

`Behavioral` · `Chain of Responsibility` · `●●●` · ~40 min

## Context

Every observation request submitted to Hollowell has to clear six checks
before it can be scheduled: is the target above the horizon, is it far
enough from the moon, is the requested instrument on this telescope, does
the exposure fit the night's budget, will pointing this close to the zenith
foul the dome (on telescopes whose dome moves), and is the weather good
enough. `validateRequest(request, telescope)` returns the first reason the
request fails, or `null` if it clears everything.

## The pressure

All six checks live in one function, as six `if`-statements in a row, in a
fixed order - the same order every time, for every telescope. One of the
six only applies to telescopes with a movable dome, and that exception is a
single `telescope.hasMovableDome &&` tacked onto its condition. Nothing here
is wrong yet: the order happens to make sense, and the one exception is
legible. What the shape cannot easily survive is *this specific order not
being right for every telescope*, or *a new check needing to slot in between
two existing ones* - both mean editing the position of code inside one
function that already has six things to keep straight.

## The target

**Chain of Responsibility.** Each check becomes its own small object that
knows how to test one thing and, if it passes, hand the request to whatever
comes next. A separate function builds the chain - in whatever order a given
telescope needs, including which checks it needs at all - and nothing about
any individual check has to know where it sits in that order.

When you are done, there should be no function containing more than one of
the six checks: each one is a class of its own, and the *order* is a fact
that exists in exactly one place.

## Done when (act 1)

- `./dp test chain-of-responsibility` is green throughout.
- `./dp shape chain-of-responsibility` no longer finds the six checks living
  together in one function, or the inline `hasMovableDome &&` guard.
- A request that fails two checks at once still reports the earlier one in
  the order - that behavior does not change, only where the order is
  recorded.
- Ridgeline (no movable dome) still allows near-zenith pointing that would
  be refused on a telescope whose dome moves.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 chain-of-responsibility`

## Hints

<details>
<summary>What should one rule's interface look like?</summary>

A `check(request, telescope)` returning a failure string or `null`, plus a
way to link to whatever comes next and a way to actually run the chain from
a given rule (`handle`). Put the linking and delegation logic in one shared
base class - every concrete rule should only have to write `check`.

</details>

<details>
<summary>Where does per-telescope order actually get decided?</summary>

One function, building a fresh chain (new rule instances) for each call,
taking the telescope as its only input. It is the only code allowed to know
the order of the six checks, or which telescope skips which one.

</details>

<details>
<summary>Do the rule objects need to know about each other?</summary>

No - each rule only needs to know how to test its own one condition. The
chain builder is the only thing that needs to know rules exist at all as a
group.

</details>

## Reading

- GoF, *Chain of Responsibility* — especially the note that a request is
  not guaranteed to be handled by anyone, and what that implies for a chain
  that must always produce *some* answer (this exercise's chains always end
  in `null`, never in "nobody handled it").
- Fowler, *Refactoring* (2nd ed.) has no single move for this; the closest
  relative is *Decompose Conditional*, applied six times and then linked
  together instead of left standalone.
- [Chain of Responsibility on refactoring.guru](https://refactoring.guru/design-patterns/chain-of-responsibility)
