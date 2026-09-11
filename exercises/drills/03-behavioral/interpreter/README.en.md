[🌐 English](./README.en.md)

# Interpreter

`Behavioral` · `Interpreter` · `●●●` · ~40 min

## Context

A scheduling policy's constraint is written as a small string - something
like `"altitude > 30 && moon_phase < 0.3"` - and checked against the sky
right now before a request is allowed to run.

## The pressure

`evaluateConstraint` reads that string with `split`, `includes` and
`===`, one `if` per shape of clause it recognizes: three named flags
(`civil_twilight_over`, `dome_open`, `clear`) checked by string equality,
then numeric comparisons found by testing whether the clause contains `>`
or `<`. Nothing is wrong yet - eleven tests pass, and the function reads
top to bottom. What the shape cannot survive is a new comparison operator
that is a *superstring* of an existing one (`>=` contains `>`), or a
fourth named flag, without the function's `if`-chain growing another
special case that has to be slotted in at exactly the right place
relative to the ones already there.

## The target

**Interpreter.** Each clause becomes an object with an `evaluate` method
- a comparison, or a named flag - built once by a small parser, and
combined with `&&` by a third kind of object that holds a list of the
others and never asks which kind they are. A new operator is one entry
in a lookup table; a new named flag is one entry in another. Neither
touches the classes that already exist.

## Done when (act 1)

- `./dp test interpreter` is green throughout.
- `./dp shape interpreter` no longer finds `clause.includes(`,
  `clause === "` or `clause.split(` anywhere in the solution.
- Adding an operator or a named term to the solution is describable as
  "one new entry in a table," not "a new `if` branch, placed carefully
  relative to the others."
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 interpreter`

## Hints

<details>
<summary>What's the smallest interface every clause can share?</summary>

One method: `evaluate(context): boolean`. A comparison and a named flag
both implement it; the object combining them with `&&` implements it too
and is, from the outside, indistinguishable from a single clause.

</details>

<details>
<summary>How does one class cover every comparison operator, not just one?</summary>

Store the operator as a string, and look up the actual comparison
function from a table (`{ ">": ..., "<": ... }`) at evaluation time. The
class that does the comparing never has an `if` chain of its own to
extend.

</details>

<details>
<summary>What breaks if a shorter operator is tested for before a longer one that contains it?</summary>

`"altitude >= 30"` gets found by an `includes(">")` check meant for
plain `>`, and split on the wrong character - `"altitude "` and `"= 30"`,
which is not a number. Whatever finds which operator a clause uses has
to try the longest candidates first.

</details>

## Reading

- GoF, *Interpreter* - the book's own example is a boolean expression
  grammar, which this exercise's constraint language is a close cousin
  of. There is no separate `refactoring.guru` page for this pattern;
  GoF is the only reference here.
