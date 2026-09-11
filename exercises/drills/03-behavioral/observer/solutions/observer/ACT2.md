# Act 2 — the measured part

Every number here comes from `./dp trade observer`, which applies the two
patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

`center.subscribe(observer)` and `center.unsubscribe(observer)` for an
arbitrary `AlertObserver`, not one of the four built-in consumers - plus the
rule that a subscribed observer whose `onAlert` throws must not stop any
other observer, built-in or not, from receiving that same alert, and must
not make `publish()` itself throw.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   2 existing files modified   ·   19 lines touched   ·   2 hunks
```

`types.ts` gains two method signatures on the `AlertCenter` interface (+2).
`center.ts` gains `subscribe()` (push), `unsubscribe()` (indexOf + splice),
and a `try`/`catch` wrapped around the one loop `publish()` already had
(+16/-1 - the one removed line is the unwrapped call, replaced by the same
call inside a `try`). No consumer file changed. `ControlRoomLog`,
`OperatorPager`, `DomeGuard` and `NightReport` never learn that `subscribe`
exists, because they were already list members before act 2 asked for
anything - act 2 only needed the list to become mutable from the outside and
the one loop around it to become defensive.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   49 lines touched   ·   3 hunks
```

Same file count, more than double the lines, and a third hunk the pattern
route does not have. The baseline also needs a `subscribers` array and
`subscribe`/`unsubscribe` methods - that part costs the same either way,
because it is the genuinely new capability act 2 is asking for, not a
consequence of how act 1 was built. What costs extra is everything act 2
did *not* have to ask for on the pattern route: since the four built-in
calls were never unified into one loop, each of the four needs its *own*
`try`/`catch` to honor "a throwing observer does not take the others down
with it" - four small, separate edits that the pattern route collapsed into
wrapping the one loop it already had. The third hunk is that difference made
visible: one hunk for the new subscriber list and its two methods, a second
and third for wrapping the four built-in calls individually (the four edits
sit close enough together to land in two diff hunks rather than four, but
they are still four distinct `try`/`catch` blocks, not one).

## What this route made worse

- **The `try`/`catch` silently swallows every error, with no way to see that
  a subscriber is broken except that it stops showing up in its own test
  double's `received` array.** This is the same trade-off either route makes
  - act 2 asked for containment, not for an error-reporting channel - but a
  route that already has one notify loop is one obvious place to add logging
  later; a route with five separate `try`/`catch` blocks is four more places
  that same fix would need to land.
- **`unsubscribe()`'s `indexOf` + `splice` only removes the *first* matching
  occurrence.** Subscribing the same observer instance twice and unsubscribing
  it once leaves it subscribed once more - correct by the letter of what act 2
  asked for, and not exercised by any test here. A reviewer is right to ask
  whether that gap matters for this domain (it is hard to imagine subscribing
  the same pager twice on purpose) before deciding it is fine to leave.
