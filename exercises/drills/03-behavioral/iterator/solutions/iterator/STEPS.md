# The route — the log is iterable; nothing outside it does page arithmetic

## When to choose this

Whenever a collection is going to have more than one caller that needs to
walk its contents. One caller doing manual index arithmetic is a shortcut;
three callers doing the same manual arithmetic, independently, is three
chances to get a boundary wrong in three different ways. `Symbol.iterator`
plus a generator is close to free in TypeScript - there is rarely a reason
not to reach for it the moment a second caller shows up.

## What it costs

`ObservationLog` becomes the only file that is allowed to know pages
exist. A genuinely new way of walking the log - not just a new filter or
limit on an existing walk - still means opening that one file, not the
caller's.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Implement `[Symbol.iterator]` as a generator | `for` over `pages`, `for` over each page, `yield` the entry. Delete nothing yet. | `refactor: make ObservationLog iterable` |
| 2 | Rewrite `allMessages` | `[...log].map(...)` replaces the double loop. | `refactor: rewrite allMessages as a traversal` |
| 3 | Rewrite `lastEntries` | `[...log].slice(...)` replaces the double loop and the manual flat array. | `refactor: rewrite lastEntries as a traversal` |
| 4 | Rewrite `findFirst` | `for (const entry of log)` with an early `return` replaces the double loop. | `refactor: rewrite findFirst as a traversal` |
| 5 | Remove `pageCount`, `entriesInPage`, `entryAt` from `ObservationLog`'s public surface | Nothing outside `log.ts` calls them anymore - keep only what the generator itself needs. | `refactor: log.ts keeps paging private` |

Step 1 is deliberately done **before** any caller is touched - it means
steps 2-4 are each a small, independently-verifiable swap of one
implementation for another, with the suite green after every single one,
rather than one commit that changes the log's shape and all three callers
at once.

## Then

```bash
./dp act2 iterator
```

What a reverse traversal and a bounded scan cost with this shape, and what
they would have cost without it, is in [ACT2.md](./ACT2.md). The full
reasoning, with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
