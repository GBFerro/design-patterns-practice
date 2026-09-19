[🌐 English](./README.en.md)

# Package tree

`Choice` · `Composite · Visitor · plain recursion` · `●●●` · ~40 min

## Context

A Ravensgate shipment is a tree: cartons contain items and other cartons, however deep the
packer wants to nest them. Two totals get computed from that tree today - `totalWeight` and
`totalVolume` - each walking every item, however deeply buried, and summing what it finds.

## The pressure

`totalWeight` and `totalVolume` each carry their own copy of the same recursion: is this node
an item, or does it have children to walk? They agree today because both were written from
the same shape at the same time - but nothing enforces that, and a new kind of total would
mean writing the walk a third time.

## The target

**One of three candidates**, and this repository isn't telling you which:

- **Composite** - every node, item or carton, is an object that can answer its own weight and
  volume; a carton asks its children and adds up what they say.
- **Visitor** - the tree stays plain data; one visitor object per total, with one method for
  each kind of node, walked by a single dispatcher function.
- **A plain recursive fold** - one generic function, given a value for a leaf and a way to
  combine a carton's children, called differently at each of the two call sites.

Read the domain above, and this: all three candidates can make `totalWeight` and
`totalVolume` share one walk instead of two - that part won't tell them apart. What's worth
sitting with is **what a "kind of node" and a "kind of total" cost to add, in each candidate,
and whether those two costs are the same number**. Write your answer down - `./dp choose
package-tree --pattern <name> --because "..."` - before you see act 2. That's the exercise.

## Done when (act 1)

- `./dp test package-tree` is green throughout, against your `src/`.
- `totalWeight` and `totalVolume` behave exactly as they do today - this is a restructuring,
  not a rewrite. `./dp diff package-tree --steps` (once you've chosen) shows one published
  route; yours doesn't have to match it, only the tests.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp choose package-tree --pattern <name> --because "..."`, then `./dp act2 package-tree`

## Hints

<details>
<summary>Do all three candidates end up sharing one walk between totalWeight and
totalVolume?</summary>

Yes - in every candidate, both totals end up driven by the same underlying recursion, just
told what to do with a leaf and how to combine a carton's children differently. The question
the exercise is really asking is what happens when a *third* thing needs walking, or when the
tree grows a node kind none of today's totals know about.

</details>

<details>
<summary>Is adding a new total the same kind of change as adding a new node kind?</summary>

Not obviously - a new total is "one more way to fold the same tree." A new node kind is "the
tree itself grew a shape none of the existing folds account for." The three candidates don't
pay the same price for these two kinds of change, and they don't pay it in the same
direction as each other.

</details>

<details>
<summary>Does `docs/TYPESCRIPT.md` say anything about this trade already?</summary>

Yes - its note on discriminated unions versus Visitor: "the union makes adding an operation
free and adding a variant a compile error everywhere... Polymorphism inverts it." That's
written about two of this exercise's three candidates, in general terms, before either one has
seen this domain's particular act 2.

</details>

## Reading

- GoF, *Composite* and *Visitor* - the *Intent* sections.
- [Composite](https://refactoring.guru/design-patterns/composite) and
  [Visitor](https://refactoring.guru/design-patterns/visitor) on refactoring.guru.
- [`docs/TYPESCRIPT.md`](../../../docs/TYPESCRIPT.md)'s section "A discriminated union is a
  first-class rival to half the book" is about exactly this exercise's tension, in general
  terms, before you've seen this domain's particular act 2.
