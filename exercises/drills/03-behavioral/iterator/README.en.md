[🌐 English](./README.en.md)

# Iterator

`Behavioral` · `Iterator` · `●●○` · ~30 min

## Context

Hollowell keeps a running log of every event in a night's observation:
targets acquired, the dome opening and closing, flares, weather notes. A
long night can produce a lot of entries, so `ObservationLog` keeps them in
fixed-size pages rather than one array that keeps growing.

## The pressure

Three reports read the log: every message in order, the last few entries,
and the first entry mentioning some word. All three are written the same
way - a loop over pages, and inside it a loop over that page's entries,
converting a page index and an offset into the entry at that position.
`PAGE_SIZE` is 4, and it is genuinely tempting for whoever writes the next
report to just write `for (let offset = 0; offset < 4; offset++)` instead
of asking the log how many entries this particular page actually has -
which works fine until the log's last page happens to have fewer than four
entries, and the report reads past the end of it. Nothing is broken yet.
What the shape cannot survive is a fourth report - each one is another
copy of the same double loop, and another chance for whoever writes it to
get the boundary case wrong.

## The target

**Iterator.** `ObservationLog` becomes directly iterable - `for (const
entry of log)`, or `[...log]` - and nothing outside the log's own file
ever converts a page index and an offset into an entry again. Implement
this with `Symbol.iterator` and a generator, not a hand-rolled
`hasNext()`/`next()` object; TypeScript and JavaScript give you the
iteration protocol for free, and reimplementing it is reimplementing the
part the language already did.

## Done when (act 1)

- `./dp test iterator` is green throughout.
- `./dp shape iterator` no longer finds a page/offset double loop, or a
  direct call to `entryAt`/`entriesInPage`, anywhere outside `log.ts`.
- `allMessages`, `lastEntries` and `findFirst` each read as a traversal
  over entries - none of them mention a page or an offset.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 iterator`

## Hints

<details>
<summary>What exactly does <code>Symbol.iterator</code> need to return?</summary>

An iterator - an object with a `next()` method returning `{ value, done
}`. You almost never write that object by hand: a generator method
(`*[Symbol.iterator]() { yield ...; }`) does it for you, and `yield`
inside nested `for` loops over your existing `pages` array is the whole
implementation.

</details>

<details>
<summary>Does the class need a separate "get an iterator" method?</summary>

No - implementing `[Symbol.iterator]()` directly on `ObservationLog` is
what makes `for (const entry of log)` and `[...log]` work on the log
itself, with no extra method name for callers to know about.

</details>

<details>
<summary>What should the three report functions look like once this is done?</summary>

Each one should be nearly as short as the sentence that describes it.
`allMessages` is a `map` over the log. `findFirst` is a `for...of` with an
early `return`. If any of them still has two nested loops, the log isn't
actually iterable yet.

</details>

## Reading

- GoF, *Iterator* - especially the note that the pattern's job is letting
  a traversal vary independently of the collection it traverses, and that
  a language with its own iteration protocol (their C++ and Smalltalk
  examples predate one) can fold the "iterator object" into that protocol
  instead of writing it by hand.
- Fowler, *Refactoring* (2nd ed.) - no single move for this; closest is
  *Extract Function* applied to the repeated loop body, then noticing the
  extracted shape is exactly what the language's own iteration protocol
  already provides.
- [Iterator on refactoring.guru](https://refactoring.guru/design-patterns/iterator)
