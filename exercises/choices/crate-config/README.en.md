[🌐 English](./README.en.md)

# Crate config

`Choice` · `Builder · Abstract Factory · an object literal` · `●●` · ~35 min

## Context

Ravensgate builds two kinds of shipping crate: an **export** crate, always wood with nails,
and a **domestic** crate, always plastic with bolts. `buildExportCrate` and
`buildDomesticCrate` each take the crate's dimensions and its `maxLoadKg`, validate them, and
return a `CrateSpec`.

## The pressure

Both functions repeat the same three checks - dimensions positive, load positive, then pick
the material's one correct fastener - written twice, once per function, because nothing
today forces them to agree.

## The target

**One of three candidates**, and this repository isn't telling you which:

- **Builder** - a `CrateSpecBuilder` with one fluent step per field (`.material()`,
  `.dimensions()`, `.maxLoad()`), validated once in `.build()`.
- **Abstract Factory** - a `CrateFamily` per material (`WoodCrateFamily`,
  `PlasticCrateFamily`), each supplying the one product that varies by material: its
  fastener.
- **An object literal** - a `Record<Material, Fastener>` lookup plus one shared validating
  function both entry points call.

Read the domain above, and this: all three candidates can make the validation and the
material-to-fastener rule live in exactly one place instead of two - that part won't tell
them apart. What's worth sitting with is **what each candidate is actually built to make
cheap, and whether the next requirement will land on that exact spot**. Write your answer
down - `./dp choose crate-config --pattern <name> --because "..."` - before you see act 2.
That's the exercise.

## Done when (act 1)

- `./dp test crate-config` is green throughout, against your `src/`.
- `buildExportCrate` and `buildDomesticCrate` behave exactly as they do today - this is a
  restructuring, not a rewrite. `./dp diff crate-config --steps` (once you've chosen) shows
  one published route; yours doesn't have to match it, only the tests.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp choose crate-config --pattern <name> --because "..."`, then `./dp act2 crate-config`

## Hints

<details>
<summary>Do all three candidates end up sharing one validation, one fastener rule?</summary>

Yes - in every candidate, `buildExportCrate` and `buildDomesticCrate` end up calling into one
shared place instead of repeating themselves. The question the exercise is really asking is
what a *family of related choices* (Abstract Factory's whole reason to exist) buys you, versus
what it costs when the next requirement doesn't happen to vary along that same family line.

</details>

<details>
<summary>Is a validating constructor the same thing as a builder?</summary>

Not quite - `docs/TYPESCRIPT.md`'s own summary table calls the idiomatic TypeScript form of
Builder "an object literal and a validating constructor," reserved for "ordered steps, or an
immutable product validated once at the end." This domain has neither ordered steps (all four
fields can be supplied in any order) nor an unusually large field count - which is worth
weighing before act 2 tells you whether that mismatch mattered.

</details>

<details>
<summary>Does `docs/TYPESCRIPT.md` say anything about Abstract Factory already?</summary>

Yes - its summary table: "When mismatching two families is the bug you are preventing - that,
not 'creating objects', is the point." That's a general claim about when the pattern earns its
keep, written before either one has seen this domain's particular act 2.

</details>

## Reading

- GoF, *Builder* and *Abstract Factory* - the *Intent* sections.
- [Builder](https://refactoring.guru/design-patterns/builder) and
  [Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory) on
  refactoring.guru.
- [`docs/TYPESCRIPT.md`](../../../docs/TYPESCRIPT.md)'s summary table rows for Builder and
  Abstract Factory are about exactly this exercise's tension, in general terms, before you've
  seen this domain's particular act 2.
