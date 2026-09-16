# The route — one interface, one shared composite base, no instanceof

## When to choose this

When a tree has two or more node kinds that answer the same question -
"what's your contribution" - and the number of kinds is expected to
grow. A single fixed shape (always exactly one level of nesting, never a
new kind) is not under-designed as a plain recursive function with a
`switch`; this route earns its keep the moment a client has to treat a
leaf and a whole subtree the same way.

## What it costs

Six small files replace three. Finding "how does a `Journey` total
itself" now means opening `journey.ts`, finding nothing there, and
following it up to `composite-node.ts` - one more hop than a single
function with four branches required.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `RouteNode` | One method, `totalMinutes(): number`. No implementations yet. | `refactor: introduce RouteNode` |
| 2 | Extract `Stop` and `Segment` | Each implements `RouteNode` directly - a leaf's `totalMinutes` is just its own field. | `refactor: extract Stop and Segment as leaves` |
| 3 | Write `CompositeRouteNode` | Abstract base holding `children: RouteNode[]`; `totalMinutes` sums them by calling `totalMinutes()` on each. | `refactor: introduce CompositeRouteNode` |
| 4 | Extract `Line` and `Journey` | Each extends `CompositeRouteNode` and adds nothing but its own constructor. | `refactor: extract Line and Journey as composites` |
| 5 | Rewrite the free `totalMinutes` function | Delete every `instanceof` branch; replace the whole body with `return node.totalMinutes();`. | `refactor: route totalMinutes through RouteNode` |

Steps 2 and 4 are each checked against the act-1 suite before the next
step starts - by the time step 4 extracts `Journey`, the pattern of "a
composite just sums its children" has already been proven once by
`Line`, so there is nothing left to invent. Step 5 is a pure deletion:
the free function shrinks from four `instanceof` checks to one
delegating call.

## Then

```bash
./dp act2 composite
```

What a new node kind costs on this route, and what it would have cost
without the pattern, is in [ACT2.md](./ACT2.md). The full reasoning,
with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
