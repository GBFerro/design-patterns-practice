[🌐 English](./README.en.md)

# Label pipeline

`Choice` · `Decorator · Template Method · a pipeline of functions` · `●●●` · ~40 min

## Context

Every Ravensgate shipment gets a printed label (`buildLabel`) and a one-line entry in the
warehouse floor's printed manifest (`buildManifestEntry`). Both need the exact same content -
a tracking header, the address, the weight, and a handful of conditional sections - just
joined differently: newlines for the label, `" | "` for the manifest line.

## The pressure

`buildLabel` and `buildManifestEntry` each carry their own copy of the same logic: header,
address, weight, then an `if` per optional section (fragile, hazmat, customs). They agree
today because they were written from the same requirements at the same time - but nothing
enforces that, and every optional section so far has meant finding and editing both.

## The target

**One of three candidates**, and this repository isn't telling you which:

- **Decorator** - wrap a base renderer with one small class per optional section, each
  deciding for itself whether it has anything to add.
- **Template Method** - one fixed skeleton (header, address, weight, extras), with a
  domestic and an international subclass supplying what differs.
- **A pipeline of functions** - the sections as an array of small functions, built once and
  consumed by both `buildLabel` and `buildManifestEntry`.

Read the domain above, and this: all three candidates can make `buildLabel` and
`buildManifestEntry` share one definition of "what goes on a label" - that part won't tell
them apart. What's worth sitting with is **what a "section" actually is** in each candidate -
a class instance wrapped around another, a step in an inherited method, or a plain value in an
array - and what each of those shapes assumes about how a section's *position* might need to
change later. Write your answer down - `./dp choose label-pipeline --pattern <name> --because
"..."` - before you see act 2. That's the exercise.

## Done when (act 1)

- `./dp test label-pipeline` is green throughout, against your `src/`.
- `buildLabel` and `buildManifestEntry` behave exactly as they do today - this is a
  restructuring, not a rewrite. `./dp diff label-pipeline --steps` (once you've chosen) shows
  one published route; yours doesn't have to match it, only the tests.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp choose label-pipeline --pattern <name> --because "..."`, then `./dp act2 label-pipeline`

## Hints

<details>
<summary>Do all three candidates end up sharing one definition between the two exported
functions?</summary>

Yes - in every candidate, `buildLabel` and `buildManifestEntry` end up calling into the same
underlying thing and just joining its result differently. The question the exercise is really
asking is what that underlying thing *is*, structurally, in each candidate.

</details>

<details>
<summary>Is every optional section attached at the start or the end of the sequence right
now?</summary>

Yes, in act 1 - fragile, hazmat and customs are all "does this apply, and if so, tack it onto
the end." Nothing in act 1 asks what happens when a new section needs to land somewhere else.

</details>

<details>
<summary>What does each candidate assume a "section" is?</summary>

A Decorator's sections are objects, each one wrapping the next - the sequence *is* the nesting
order, decided once, at construction time. A Template Method's sections are steps inside one
inherited method - their order is the order the method's own body calls them in. A pipeline's
sections are values sitting in an array - their order is just the array's order, which is data,
not code.

</details>

## Reading

- GoF, *Decorator* and *Template Method* - the *Intent* sections.
- [Decorator](https://refactoring.guru/design-patterns/decorator) and
  [Template Method](https://refactoring.guru/design-patterns/template-method) on
  refactoring.guru.
- [`docs/TYPESCRIPT.md`](../../../docs/TYPESCRIPT.md)'s own note on Chain of Responsibility -
  "an array of predicates you reduce over" - is the closest existing description in this
  repository of what the third candidate here actually is.
