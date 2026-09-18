# Act 2 — the measured part

Every number here comes from `./dp trade order-events`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A fraud hold. A new, frozen function - `fraudCheck(order)` - decides whether an order is held.
A held order must not fire `sendConfirmationEmail` or `sendSmsNotification`; it must still fire
`updateInventoryCount` and `recordAnalyticsEvent`, exactly as before. A clean order's four
consumers still fire in the act-1 order, unchanged. Both `orderShipped` and
`resendOrderNotifications` must respect the hold identically.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   1 existing file modified   ·   7 lines touched   ·   2 hunks
```

One import and one `if` wrapped around the last two calls in `dispatch()`. **Neither
`order-events.ts` nor `index.ts` changed at all** - both exported functions still just call
`mediator.dispatch(order)`, unaware anything changed underneath them.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+1 new file   ·   1 existing file modified   ·   13 lines touched   ·   1 hunk
```

Fewer hunks than this route - `src/order-events.ts`'s two functions sit close enough together
that git merges them into one hunk - but nearly twice the lines, because the same `if
(!fraudCheck(order))` wrapper had to be written out **twice**, once inside `orderShipped` and
once inside `resendOrderNotifications`, since act 1 never gave those two functions anything to
share. Fewer files and fewer hunks is a real property of this baseline, and also not the
dimension the budget was set on: the budget is mediator's own numbers, and 13 lines is more
than the 7 this route needed.

## What the other two candidates cost

Neither of these patches ships in `patches/` under the name `./dp trade` looks for - only one
solution can be `absorbsAct2`. They're measured the same way, kept as `observer-act2.patch` and
`chain-of-responsibility-act2.patch` for anyone who wants to reproduce the numbers:

```
observer                  +1 new file · 2 existing files modified · 38 lines touched · 2 hunks
chain-of-responsibility    +1 new file · 2 existing files modified · 8 lines touched  · 3 hunks
```

Observer is by far the most expensive of all four measured routes: its subject had to grow a
second subscriber list and a second notify path before the hold could be expressed at all, on
top of every consumer class itself being untouched. Chain of Responsibility comes close to this
route's line count - one new link, one array update - but needs one more hunk across one more
file than a route that only had to touch a single existing method. See
[`solutions/observer/ACT2.md`](../observer/ACT2.md) and
[`solutions/chain-of-responsibility/ACT2.md`](../chain-of-responsibility/ACT2.md) for the
detail.

## What this route made worse

- **`dispatch()` now has an `if` inside a flat sequence of four calls.** Small today - but it's
  the first branch this method has ever needed, and `docs/TYPESCRIPT.md`'s own warning about
  this pattern ("still one bad day away from a god object") is about exactly this kind of
  method quietly accumulating conditions over time.
- **A sixth consumer that also needs to be held-aware means another branch in the same
  method**, not a new class or a new array entry the way `observer` or
  `chain-of-responsibility` would absorb it. Worth naming as a real gap, not a strength this
  route happens to lack.
