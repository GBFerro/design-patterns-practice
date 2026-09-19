[🌐 English](./README.en.md)

# Warehouse registry

`Choice` · `Singleton · a module · injection` · `●●` · ~30 min

## Context

Ravensgate keeps one shared list of bin locations - `registerBin`, `binLocation`,
`binsInAisle` - read and written from wherever the warehouse floor's software needs to know
where something is.

## The pressure

`src/`'s registry is a lazy singleton: a module-level array, built on first use, with a
`resetRegistry` escape hatch that exists purely so tests can isolate themselves from each
other - a sign the shared-instance design is already fighting the test suite.

## The target

**One of three candidates**, and this repository isn't telling you which:

- **Singleton** - a class with a private constructor; `getInstance()` is the only way in.
- **A module** - the same "exactly one, shared" guarantee, without the class ceremony.
- **Injection** - an explicit `createWarehouseRegistry()` factory; callers build their own,
  no shared instance anywhere.

Read the domain above, and this: all three candidates can make `registerBin`/`binLocation`/
`binsInAisle`/`resetRegistry` behave identically for act 1 - that part won't tell them apart.
What's worth sitting with is **what "exactly one" costs to walk back**, the day something
legitimately needs two. Write your answer down - `./dp choose warehouse-registry --pattern
<name> --because "..."` - before you see act 2. That's the exercise.

## Done when (act 1)

- `./dp test warehouse-registry` is green throughout, against your `src/`.
- `registerBin`, `binLocation`, `binsInAisle` and `resetRegistry` behave exactly as they do
  today - this is a restructuring, not a rewrite. `./dp diff warehouse-registry --steps` (once
  you've chosen) shows one published route; yours doesn't have to match it, only the tests.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp choose warehouse-registry --pattern <name> --because "..."`, then `./dp act2 warehouse-registry`

## Hints

<details>
<summary>Do all three candidates give every caller the same one registry in act 1?</summary>

Yes - in every candidate, `registerBin` and friends all read and write the same one registry,
the whole way through act 1. The question the exercise is really asking is what happens the
day the app legitimately needs a *second* one, live at the same time as the first.

</details>

<details>
<summary>Is "exactly one, reachable from anywhere" one guarantee or two?</summary>

`docs/TYPESCRIPT.md`'s own framing: "GoF's Singleton bundles 'there is exactly one' with
'anyone can reach it'." Two of this exercise's three candidates keep both halves of that
bundle; one of them keeps neither, on purpose.

</details>

<details>
<summary>Does `docs/TYPESCRIPT.md` say anything about Singleton already?</summary>

Its own verdict is `avoid`, for a print-shop settings module built the same way this
registry's `src/` is - written before either one has seen this exercise's particular act 2,
but naming the exact tension act 2 is about to test.

</details>

## Reading

- GoF, *Singleton* - the *Intent* section.
- [Singleton](https://refactoring.guru/design-patterns/singleton) on refactoring.guru.
- [`docs/TYPESCRIPT.md`](../../../docs/TYPESCRIPT.md)'s "Singleton solved two problems;
  TypeScript splits them" section is about exactly this exercise's tension, in general terms,
  before you've seen this domain's particular act 2.
