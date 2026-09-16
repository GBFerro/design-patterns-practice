# What TypeScript already solved

The GoF catalogue was written in 1994 against C++ and Smalltalk. refactoring.guru explains the
23 patterns better than this repository ever will. Neither tells you **which of them your
language has already absorbed** — and that is the question that decides whether applying one
today is engineering or cosplay.

> **Status.** Entries whose drill exists are marked ✅ and have been verified against working
> code. The rest are marked 🚧: they are this repository's working hypothesis, and each one may
> change when its drill gets written. Saying which is which is the point — a document like this
> is worth reading only if it admits where it is still guessing.

## The summary table

| Pattern | In TypeScript | When the classic form earns its keep again |
| --- | --- | --- |
| **Strategy** ✅ | A function type, plus a `Record` to look it up | When the strategy needs a second member, carries state, or must be discovered by name. See below. |
| **Command** ✅ | A closure | `undo`, serialisation, a name, or composition into a macro |
| **Template Method** ✅ | A higher-order function taking hooks | Many hooks and a stable family: inheritance documents the contract better than six optional callbacks |
| **Iterator** ✅ | `Symbol.iterator` and generators | **Never write `hasNext()/next()`.** Implement the language's protocol; the drill asks for exactly that |
| **Observer** ✅ | `EventTarget`, an emitter, signals | When ordering, unsubscription and error isolation matter — at which point you are writing the pattern anyway |
| **State** ✅ | Objects, same as the book | Barely changes. A discriminated union covers the data; the transitions still want objects |
| **Visitor** ✅ | A discriminated union and an exhaustive `switch`, with the compiler as the net | When the node set is open, or nodes come from outside your code |
| **Chain of Responsibility** ✅ | An array of predicates you reduce over | When a link must be able to stop the chain *and* the chain is configured per caller |
| **Mediator** ✅ | Unchanged | Unchanged — and still one bad day away from a god object |
| **Memento** ✅ | `#private` fields and a branded type for the opaque token | The intent ("the caretaker must not read it") is the hard part in TS, not the mechanics |
| **Interpreter** ✅ | A discriminated union plus a recursive `evaluate` | Unchanged in spirit; the union replaces the class hierarchy |
| **Adapter** ✅ | Structural typing: no `implements`, an object literal is enough | When the adapter holds state or must be swapped at runtime |
| **Decorator** ✅ | Function composition for one-method interfaces | More than one method, or the wrapper needs state |
| **Facade** ✅ | A module | A module *is* the pattern. The only real rule: a facade that leaks its subsystems is not one |
| **Proxy** 🚧 | `Proxy` (the built-in) for the general case; a hand-written wrapper for one interface | Unchanged. Note the built-in and the pattern share a name and little else |
| **Composite** ✅ | Unchanged | Unchanged. A discriminated union of node types is the TS-flavoured variant |
| **Bridge** ✅ | Generics cover part of it | When both axes are genuinely open. Otherwise you have one axis and a long name |
| **Flyweight** ✅ | A `Map` of interned values | Only with a measurement. Without numbers it is pure cost |
| **Factory Method** ✅ | A function | When the choice of product varies with a subtype you already have |
| **Abstract Factory** ✅ | An object of factory functions | When mismatching two families is the bug you are preventing — that, not "creating objects", is the point |
| **Builder** ✅ | An object literal and a validating constructor | Ordered steps, or an immutable product validated once at the end |
| **Prototype** ✅ | `structuredClone` | Polymorphic copying, or objects with identity and resources |
| **Singleton** ✅ | A module-level `const` | Verdict `avoid`. See below — the pattern solved two problems and TS splits them |

## The three notes that cause real confusion

### `@decorators` are not the Decorator pattern

TypeScript's `@something` syntax is metaprogramming at the declaration site. The pattern is
composition at runtime. They share a name and nothing else. A codebase that uses the syntax to
implement the pattern has usually made both harder to follow.

### A discriminated union is a first-class rival to half the book

```ts
type Node =
  | { kind: "stop"; minutes: number }
  | { kind: "walk"; minutes: number }
  | { kind: "line"; segments: readonly Node[] };
```

With `switch (node.kind)` and a `never` check in the default branch, the compiler proves you
handled every case. Polymorphism cannot prove that. So for a **closed** set of variants, the
union is often safer than the pattern — and several `choices/` exercises list it as a
candidate, sometimes as the winner.

The trade is the classic one, sharpened: the union makes *adding an operation* free and
*adding a variant* a compile error everywhere (which is a feature). Polymorphism inverts it.
Visitor is the pattern that lives exactly on this line.

### Singleton solved two problems; TypeScript splits them

GoF's Singleton bundles "there is exactly one" with "anyone can reach it". In TypeScript:

- *exactly one* is what a module gives you, for free, with no lazy-init dance;
- *anyone can reach it* is the part that makes tests impossible to isolate, and the answer is
  to pass the thing in.

Which is why the verdict is `avoid` and the drill's solution folder is called
`module-and-injection/`. The walkthrough still owes you the case where a singleton is the least
bad answer — there is one, and it involves initialisation that must happen once, late, with
dependencies.

## Strategy, verified ✅

The reference drill ([`drill-strategy`](../exercises/drills/03-behavioral/strategy/)) is the
one entry here backed by working code, so it is worth being precise.

The four-line version:

```ts
type Rank = (candidates: readonly ObservationRequest[]) => readonly ObservationRequest[];
const policies: Record<string, Rank> = { "max-targets": rankByDuration /* … */ };
```

For a policy that is *only* an ordering, that is better code than the interface. What the
object form actually buys, measured in that drill:

1. **The name lives with the behaviour.** In the `Record`, the key and the function are in
   different places and nothing stops them disagreeing. The act-2 requirement is an error
   message listing every available policy; with names on the policies it costs zero lines,
   because the list is derived. That was the difference between 3 lines touched and 23.
2. **Room for a second member.** The moment a policy needs a description, a configuration or a
   cost estimate, `Record<string, Rank>` becomes `Record<string, {…}>` — the interface, arrived
   at later, with a migration to do.
3. **Discoverability.** `policies.map(p => p.name)` is a question you ask of a collection of
   things, not of a lookup table.

So in TypeScript, **Strategy is a bet that the varying thing will grow a second member.** Lose
that bet and you wrote five files where four lines would have done. That sentence is the
honest summary, and it generalises: most of this table is about whether the pattern's extra
structure is a bet you are likely to win.

## How to use this document

Read the row for your pattern **before** you start the drill, and again after. The drill asks
for the GoF shape in most cases, on purpose — you cannot judge what the language replaced
until you can write what it replaced. The walkthrough is where each exercise argues with this
table, and where it says so when the idiomatic TypeScript answer is not the one the drill asked
for.

## Sources

- GoF, *Design Patterns*, 1994 — *Applicability* and *Consequences* for each pattern
- [refactoring.guru](https://refactoring.guru/design-patterns/catalog) — the catalogue and,
  more usefully, *Relations with Other Patterns*
- TypeScript handbook: discriminated unions, `structuredClone`, private class fields
- Node 22 `--experimental-transform-types`, which is what runs every example here
