[🌐 English](./README.en.md)

# Composite

`Structural` · `Composite` · `●●○` · ~30 min

## Context

Caldermoor's network is a tree: stops and segments (single hops) are the
leaves, lines are built out of them, and a rider's journey is built out
of lines and segments in turn - sometimes a journey even contains
another journey, when a trip is planned as a sequence of legs.

## The pressure

`totalMinutes` is one recursive function that adds up how long any of
these takes. It checks what it was handed with `instanceof`: a `Stop`
contributes its dwell time, a `Segment` its travel time, and a `Line` or
a `Journey` sums its children by calling `totalMinutes` on each one -
the exact same `reduce`, written twice, once per composite type.
Nothing is wrong yet - the four `instanceof` checks are easy to read in
one function - but every node kind this function doesn't already know
about is a node kind it cannot total.

## The target

**Composite.** One `RouteNode` interface with a single method,
`totalMinutes()`. `Stop` and `Segment` implement it directly, as leaves.
`Line` and `Journey` share one `CompositeRouteNode` base class that
implements it once, by summing whatever children it was given - neither
composite writes its own summing logic. The free `totalMinutes` function
that's left over just calls `node.totalMinutes()`; it never asks what
kind of node it has.

## Done when (act 1)

- `./dp test composite` is green throughout.
- `RouteNode`, `CompositeRouteNode`, `Stop`, `Segment`, `Line` and
  `Journey` all exist, and `Line`/`Journey` both extend
  `CompositeRouteNode` rather than each summing their own children.
- The free `totalMinutes` function contains no `instanceof` at all.
- Your `git log --oneline` shows small steps, each leaving the suite
  green.

## Then run `./dp act2 composite`

## Hints

<details>
<summary>What's the one method every node - leaf or composite - has to implement?</summary>

`totalMinutes(): number`. A leaf returns its own number; a composite
returns the sum of its children's.

</details>

<details>
<summary>Do `Line` and `Journey` need their own `totalMinutes` method?</summary>

No - that's the duplication act 1 has. One `CompositeRouteNode` base
class implements `totalMinutes` by summing `children`; `Line` and
`Journey` each just extend it, contributing nothing but their own
constructor if they need one.

</details>

<details>
<summary>What should the free `totalMinutes(node)` function look like when you're done?</summary>

`return node.totalMinutes();` - one line, no `instanceof`, no
knowledge of how many node kinds exist.

</details>

## Reading

- GoF, *Composite* - the *Intent* section: "compose objects into tree
  structures to represent part-whole hierarchies... lets clients treat
  individual objects and compositions of objects uniformly."
- [Composite on refactoring.guru](https://refactoring.guru/design-patterns/composite)
