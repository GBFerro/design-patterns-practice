[🌐 English](./README.en.md)

# Abstract Factory

`Creational` · `Abstract Factory` · `●●●` · ~35 min

## Context

Thornbury runs two press families - digital and offset - each needing
its own matched plate, ink system and feeder. The three part kinds are
built by three independent functions, each switching on family.

## The pressure

`createPlate`, `createInkSystem` and `createFeeder` each pick the right
class for a given `family`, correctly, today. Nothing stops a caller
from asking each function for a *different* family and combining the
results - `createPlate("digital")` next to `createInkSystem("offset")`
compiles without complaint. The only thing that catches this is
`assemblePress`, a runtime check that fires when the press is actually
put together, which is the last moment anyone would want to find out.

## The target

**Abstract Factory.** One `PressFactory` interface providing all three
parts; one concrete factory per family, each guaranteed by the compiler
to implement all three methods. A caller asks for *a factory*, not for
three separate parts, and every part that factory hands back belongs to
the same family by construction.

## Done when (act 1)

- `./dp test abstract-factory` is green throughout.
- `createPlate`, `createInkSystem` and `createFeeder` still exist with
  the same signatures, but no longer contain their own `switch` - each
  delegates to one factory, looked up by family.
- A new concrete factory that forgets to implement one of the three
  methods is a compile error, not a runtime surprise.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 abstract-factory`

## Hints

<details>
<summary>What's the smallest interface that guarantees a matched set?</summary>

Three methods, one per part, on one interface - `PressFactory`. A class
implementing it either provides all three or does not compile.

</details>

<details>
<summary>Where should the family-to-factory mapping live?</summary>

One table, `Record<PressFamily, PressFactory>` - the same shape this
repo's Factory Method drill uses for job kinds, one level up: here the
table maps to a *factory that makes three things*, not to one thing.

</details>

<details>
<summary>Does the runtime check in assemblePress still matter once every part comes from one factory?</summary>

Only as a backstop for code that builds parts by hand instead of going
through a factory - which is still possible, since `createPlate` and
friends remain independently callable. The walkthrough and ACT2.md say
more about what this means for the guarantee's actual strength.

</details>

## Reading

- GoF, *Abstract Factory* - the *Intent* section: "provide an interface
  for creating families of related or dependent objects without
  specifying their concrete classes."
- [Abstract Factory on refactoring.guru](https://refactoring.guru/design-patterns/abstract-factory)
