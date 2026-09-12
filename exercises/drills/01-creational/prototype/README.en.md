[🌐 English](./README.en.md)

# Prototype

`Creational` · `Prototype` · `●●○` · ~30 min

## Context

Thornbury keeps a small set of saved job templates - a rush banner, a
standard letterhead - and every new order starts as a clone of one of
them, never the template itself.

## The pressure

`cloneTemplate` copies a template's fields by hand, one at a time. It is
correct today - but only because someone already got bitten once: an
earlier version forgot to copy `finishingOptions` at all, just handed
back the same array, and two "independent" clones ended up editing each
other's finishing options. `tests/template.test.ts` has carried the
regression test for that ever since. The function is right, but nothing
about its shape stops the next field from being forgotten the same way -
whoever adds a field to `JobTemplate` has to separately remember to add
it to `cloneTemplate`, and the type checker will only catch it if the
new field is annotated as required and the function's return type is
still spelled out explicitly.

## The target

**Prototype**, by way of `structuredClone`. Cloning stops naming
`JobTemplate`'s fields at all - it copies whatever the object happens to
have. A field added to the type needs a value in the template data and
nothing else; the clone operation cannot forget it, because it was never
told what to look for in the first place.

## Done when (act 1)

- `./dp test prototype` is green throughout.
- `cloneTemplate`'s signature is unchanged - same name, same parameter,
  same return type.
- `cloneTemplate`'s body does not name a single field of `JobTemplate`.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 prototype`

## Hints

<details>
<summary>What does the platform already provide for "copy this object, deeply, whatever shape it is"?</summary>

`structuredClone`. It is not part of the "ES2023" language-level lib this
repo's exercises typecheck against, so it needs one small ambient
declaration - see the solution for exactly what that looks like and why.

</details>

<details>
<summary>Does the regression test in `tests/template.test.ts` still need to exist after the refactor?</summary>

Yes - it is still testing a real property (independent, mutable arrays
per clone), it just stops being the *only* thing standing between a
future field and the bug it originally caught.

</details>

## Reading

- GoF, *Prototype* - the *Intent* section: "specify the kinds of objects
  to create using a prototypical instance, and create new objects by
  copying this prototype."
- [Prototype on refactoring.guru](https://refactoring.guru/design-patterns/prototype)
