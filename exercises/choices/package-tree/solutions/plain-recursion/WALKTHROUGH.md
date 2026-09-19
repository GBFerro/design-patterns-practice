# Walkthrough — Package tree at Ravensgate

Read this **after** you have your own version and your own `CHOICE.md`.

---

## The structure

This candidate isn't one of the 23 GoF patterns, so there's no book diagram to map against -
that's the point of offering it as a candidate at all. What it is: `reduceTree` is a generic
fold over the tree - a function from a leaf item to a value, and a function that combines a
carton's already-folded children into one value - and every total is just a different pair of
those two functions handed to the same fold.

```mermaid
classDiagram
    class reduceTree~T~ {
        <<function>>
        (node, fromItem, combine) T
    }
    class fromItem {
        <<function>>
        (item) T
    }
    class combine {
        <<function>>
        (childValues) T
    }
    class totalWeight {
        <<function>>
    }
    class totalVolume {
        <<function>>
    }
    reduceTree ..> fromItem : calls on every leaf
    reduceTree ..> combine : calls on every carton
    totalWeight ..> reduceTree : supplies weightKg + sum
    totalVolume ..> reduceTree : supplies volumeM3 + sum
```

**On the mapping.** There's no `Component`/`Leaf`/`Composite` triad here, and no `Visitor`
interface either - the closest thing this repository already says about this shape is
[`docs/TYPESCRIPT.md`](../../../../../docs/TYPESCRIPT.md)'s section "A discriminated union is
a first-class rival to half the book," which names the general trade this candidate lives
inside: a `switch (node.kind)` (here, hidden one level down inside `reduceTree` itself) makes
adding an operation free and adding a variant a compile error everywhere it isn't handled.
This candidate is that trade applied literally - `reduceTree`'s own body is the one and only
`switch`, and every total is "free" in the sense that it costs two functions, not a new type.

**On the name.** `reduceTree`, not `fold` or `walk`. `fold` is the standard name for this
shape in functional-programming vocabulary generally, but this repository's own domain
functions don't use that word anywhere else - question 2 from
[`docs/NAMING.md`](../../../../../docs/NAMING.md) asks whether a name could mean something
else in this file, and `walk` is already how the visitor candidate names its dispatcher
elsewhere in this exercise, which would make the same word mean two different things across
routes a reader might compare side by side. `reduceTree` says exactly what happens: the tree
goes in, one value comes out.

**On the name, a second time.** `combine`, not `merge` or `reducer`. `reducer` fails question
4 - it's true of the whole function, not just this one parameter, and would leave a reader
unsure whether `combine` reduces the *whole tree* or just *one carton's children*, which is
all it actually does.

**On the name, a third time.** `fromItem`, not `leaf` or `base`. `base` fails question 1 - it
says how the value gets built (from the bottom) rather than what the caller supplies (a value
*for* an item), and "base case" is recursion vocabulary that belongs in a comment, not a
parameter a caller has to read and supply correctly.

---

## Why this candidate, over the other two

Both Composite and Visitor were live options through all of act 1 - either one produces
working code that passes every act-1 test, and `solutions/composite/` and `solutions/visitor/`
in this repository prove it. What decided it, once act 2 arrived: **act 2 asked for a new
node kind and a new operation at the same time**, and neither Composite nor Visitor has a
place that absorbs both cheaply - each one is built to make exactly one of those two changes
free, at the cost of making the other expensive. This candidate has no such asymmetry to
begin with: neither a new node kind nor a new operation has a dedicated place to attach to,
so both cost roughly the same, and act 2's combination doesn't hit a specific weak point the
way it does for the other two. See
[`solutions/composite/WALKTHROUGH.md`](../composite/WALKTHROUGH.md) and
[`solutions/visitor/WALKTHROUGH.md`](../visitor/WALKTHROUGH.md) for how each of those routes
actually absorbed the change.

---

## Step 1 — one fold, two callbacks per total

```ts
function reduceTree<T>(
  node: PackageNode,
  fromItem: (item: Item) => T,
  combine: (childValues: readonly T[]) => T,
): T {
  if (node.kind === "item") {
    return fromItem(node);
  }
  return combine(node.children.map((child) => reduceTree(child, fromItem, combine)));
}
```

Every total - present or future - is a call to this one function with a different pair of
callbacks. That's the property act 2 measures: neither total "owns" the recursion, so neither
one has to change when the *other* one changes.

---

## Where TypeScript changes this

[`docs/TYPESCRIPT.md`](../../../../../docs/TYPESCRIPT.md) doesn't have a row for "plain
recursive fold" - it isn't a pattern - but its Composite and Visitor rows both point at the
same underlying fact this route is built from: a discriminated union plus a function that
switches on `.kind` covers a large fraction of what the object-oriented forms of both patterns
exist to provide, in a language with structural types and exhaustiveness checking. This
route's real cost, per that same document's own framing, is the one the union always pays:
nothing forces every branch of a *future* `combine` function to agree on what a new node kind
means, the way an interface method or a visitor method would.

---

## What it cost

- **`reduceTree`'s signature is shared infrastructure with no name of its own.** A reader
  has to open this file to understand what "combine" and "fromItem" mean for a given total;
  neither Composite's method names nor Visitor's `visit*` methods need that.
- **Nothing enforces that a `combine` function is total-agnostic-safe.** Two callbacks that
  happen to compute unrelated things can both typecheck as `(childValues: number[]) => number`
  without either one being obviously wrong.
- **See [ACT2.md](./ACT2.md) for the actual price** of the pallet-and-item-count requirement,
  measured, and for how the other two candidates fared against the same requirement.

## What act 2 showed

See [ACT2.md](./ACT2.md) for the numbers: 44 lines and 3 hunks here, against 26 lines and 4
hunks with no pattern at all, and fewer hunks than both other candidates too. The shape of the
win matters as much as the size: every line of this route's `totals.ts` change sits in one
contiguous edit - not scattered across three functions the way the no-pattern baseline's
change is, and not repeated once per class the way Composite's six-hunk change is.
