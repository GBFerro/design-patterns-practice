# Act 2 — the measured part

Every number here comes from `./dp trade order-events`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff (the same two files `./dp trade`
reads).

```
+1 new file   ·   2 existing files modified   ·   38 lines touched   ·   2 hunks
```

Worse than [`mediator`](../mediator/ACT2.md)'s 7 lines on every dimension, and worse than
[`chain-of-responsibility`](../chain-of-responsibility/ACT2.md)'s 8, and nearly three times the
no-pattern baseline's 13. `subject.ts` grows a second subscriber list, a second `subscribe*`
method, and a second branch inside `notifyAll` - almost the entire cost sits in this one file.
`order-events.ts` changes too, but only to call the two new subscribe methods and pass
`fraudCheck(order)` into `notifyAll`; none of the four observer classes themselves change at
all.

## What this route made worse

- **`subject.ts` now carries two lists and two subscribe methods for what used to be one of
  each.** The distinction between "always" and "conditional" subscribers exists nowhere except
  in which method a given `order-events.ts` call happens to use - nothing type-checks that a
  consumer was subscribed the right way.
- **Nothing about this route's act-1 structure predicted this cost.** The four observer classes
  were the smallest, most focused files of any candidate in act 1 - the exercise's own hint
  about whether some consumers need to be told apart from others is the piece of information
  that would have flagged this in advance, and it isn't visible from reading any single
  observer class in isolation.
