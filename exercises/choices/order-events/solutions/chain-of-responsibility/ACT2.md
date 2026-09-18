# Act 2 — the measured part

Every number here comes from `./dp trade order-events`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff (the same two files `./dp trade`
reads).

```
+1 new file   ·   2 existing files modified   ·   8 lines touched   ·   3 hunks
```

Close to [`mediator`](../mediator/ACT2.md)'s 7 lines, but one more file and one more hunk - and
better than the no-pattern baseline's 13 lines, though at the cost of one more file and two more
hunks than that baseline needed. `links.ts` gains one new `Link` value, `fraudLink` (three
lines, including its own import); `order-events.ts` changes its `links` array to insert
`fraudLink` between `analyticsLink` and `emailLink` - the one position where it silences email
and sms without touching inventory or analytics. **Neither `runChain` nor either exported
function changed at all** - the chain-walking logic doesn't need to know why a link stopped it.

## What this route made worse

- **The `links` array is now order-sensitive in a way that isn't visible from any single
  link's file.** `fraudLink` has to sit after `analyticsLink` and before `emailLink` for the
  hold to work correctly; nothing in the types enforces that position, only the test suite.
- **One more file changed than [`mediator`](../mediator/ACT2.md)'s route needed**, despite
  this pattern's own stop-the-chain mechanism being the closest conceptual match for the
  requirement - the measured cost and the conceptual fit pointed in different directions here.
