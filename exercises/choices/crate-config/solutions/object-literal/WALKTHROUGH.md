# Walkthrough — Crate config at Ravensgate

Read this **after** you have your own version and your own `CHOICE.md`.

---

## The structure

This candidate isn't one of the 23 GoF patterns, so there's no book diagram to map against -
that's the point of offering it as a candidate at all. What it is: one `Record` maps each
material to its one fastener, and one function shares the validation both entry points need,
reading the fastener out of that record instead of branching or dispatching to an object:

```mermaid
classDiagram
    class FASTENER_BY_MATERIAL {
        <<const>>
        wood: "nails"
        plastic: "bolts"
    }
    class assembleCrate {
        <<function>>
        (material, dims, maxLoadKg) CrateSpec
    }
    class buildExportCrate {
        <<function>>
    }
    class buildDomesticCrate {
        <<function>>
    }
    assembleCrate ..> FASTENER_BY_MATERIAL : looks up
    buildExportCrate ..> assembleCrate : "wood"
    buildDomesticCrate ..> assembleCrate : "plastic"
```

**On the mapping.** There's no `CrateFamily` interface and no `CrateSpecBuilder` class - the
one piece of "which fastener goes with which material" knowledge lives as data, not as
polymorphism. `docs/TYPESCRIPT.md`'s own summary table names this shape directly: Builder's
idiomatic TypeScript form is "an object literal and a validating constructor," and this route
is close to exactly that, applied to a domain where Abstract Factory's family axis was also
never needed for anything but reading `.material` back out.

**On the name.** `assembleCrate`, not `makeCrate` or `crateFrom`. `makeCrate` fails question 2
from [`docs/NAMING.md`](../../../../../docs/NAMING.md) - `buildExportCrate` and
`buildDomesticCrate` already use "build" for the public entry points, and reusing a near-synonym
for the private helper they both call would leave a reader guessing whether the two words mean
different things. `assembleCrate` says what actually happens: existing validated pieces get put
together, nothing is fetched or constructed from scratch.

**On the name, a second time.** `FASTENER_BY_MATERIAL`, not `FASTENERS` or `MATERIAL_MAP`.
`FASTENERS` fails question 4 - it would be true of any collection of fasteners, not
specifically a lookup keyed by material, and a reader skimming the file needs to know which
direction the mapping goes without opening it.

**On the name, a third time.** `material`, not `kind` or `type`, as the parameter name in
`assembleCrate`. `type` fails question 1 - it says nothing about *what kind of thing* varies,
where `material` is the exact word this domain's own frozen `Material` type already uses,
keeping the parameter and the type it's typed as readable as the same concept.

---

## Why this candidate, over the other two

Both Builder and Abstract Factory were live options through all of act 1 - either one produces
working code that passes every act-1 test, and `solutions/builder/` and
`solutions/abstract-factory/` in this repository prove it. What decided it, once act 2
arrived: **act 2's new rule doesn't vary along either pattern's axis.** It isn't an ordered or
optional-step concern Builder was built to manage, and it isn't a per-family concern Abstract
Factory was built to protect - it's one flat, material-independent check. This candidate has
no axis of its own to be irrelevant *to*: `assembleCrate` just grows one more parameter and one
more check, the same way it would for any future rule that also doesn't care which material was
chosen. See [`solutions/builder/WALKTHROUGH.md`](../builder/WALKTHROUGH.md) and
[`solutions/abstract-factory/WALKTHROUGH.md`](../abstract-factory/WALKTHROUGH.md) for how each
of those routes actually fared against the same change.

---

## Where TypeScript changes this

[`docs/TYPESCRIPT.md`](../../../../../docs/TYPESCRIPT.md) doesn't have a row for "object
literal plus a validating function" as its own pattern - it isn't one - but its Builder row
("an object literal and a validating constructor... ordered steps, or an immutable product
validated once at the end") and its Abstract Factory row ("when mismatching two families is
the bug you are preventing") both point at the same fact this route is built from: neither
pattern's stated reason to exist was present in this domain to begin with, so the plainest
possible shape - a lookup and a function - was never giving anything up by staying plain.

---

## What it cost

- **`assembleCrate` isn't guarded by a type the way `CrateFamily` guards Abstract Factory's
  route.** Nothing stops a future caller from passing a `material` string that isn't in
  `FASTENER_BY_MATERIAL` at the type level beyond `Material` itself already being a union of
  exactly two values - which is real protection, but it's the frozen boundary's doing, not this
  route's.
- **There's no dedicated place for "everything about one material" to live**, the way
  `WoodCrateFamily` gives that a name and a class. If a future requirement genuinely needed to
  vary *by family* - several coordinated choices, not one - this route would have to introduce
  exactly the structure Abstract Factory already has.
- **See [ACT2.md](./ACT2.md) for the actual price** of the insulated-crate requirement,
  measured, and for how the other two candidates fared against the same requirement.

## What act 2 showed

See [ACT2.md](./ACT2.md) for the numbers: 14 lines and 6 hunks here, tied byte-for-byte with
Abstract Factory, and cheaper than both the no-pattern baseline (15 lines) and Builder (19
lines, 8 hunks). The tie is the finding: once neither pattern's axis was the axis act 2 varied
along, the class-based family route and the plain lookup did exactly the same work.
