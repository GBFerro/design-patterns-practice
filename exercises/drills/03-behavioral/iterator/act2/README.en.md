[🌐 English](./README.en.md)

# Act 2 — the last few, and only as many as needed

Ops wants the log to answer "recent" questions from the recent end, not by
reading from the start every time - and two new reports need exactly that.

**`recentMessages(log, count)`** returns the `count` most recent messages,
**most recent first** - the opposite order from `lastEntries`. A night can
run to thousands of entries; getting the last three should not mean
reading the log from the very first one. `lastEntries` itself gets the
same expectation: it must keep returning what it always returned, just
without paying for entries it doesn't need.

**`mostRecentMatch(log, needle)`** is `findFirst`'s mirror image - the most
recent entry containing `needle`, found by searching from the end backward,
not the most recent one found by reading forward to the end.

**`firstMatches(log, needle, limit)`** returns up to `limit` entries whose
message contains `needle`, **in the order they occurred**, and must stop
looking the moment it has `limit` of them. A search that is satisfied after
the second match has no business continuing to the fourth.

`recentMessages` and `firstMatches` return `{ ..., scanned }` alongside
their result - the number of entries the function actually visited to
produce it. This is not decoration: it is what ops is asking for these
reports to prove. A `recentMessages(log, 2)` on a thousand-entry night
should visit something close to 2, not something close to 1000. A
`firstMatches(log, "flare", 1)` that finds its one match on the third entry
should report `scanned: 3`, never the size of the whole log.
