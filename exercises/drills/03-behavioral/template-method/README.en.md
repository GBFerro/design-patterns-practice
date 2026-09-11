[🌐 English](./README.en.md)

# Template Method

`Behavioral` · `Template Method` · `●●○` · ~35 min

## Context

Every night at Hollowell, three instruments take turns on the mount: a wide-field
survey camera, a long-slit spectrograph, and a thermal imager. Each one goes
through the same five stages — connect, calibrate, capture, download,
disconnect — and each stage means something different depending on which
instrument is up.

## The pressure

`runNight` dispatches to three functions, one per instrument, and each one
repeats the same five `steps.push(...)` calls in the same order, with different
numbers and strings in between. Nothing about the order has ever changed in the
three instruments that exist. If it needs to — say, a sixth stage gets added, or
the download size needs to be rounded the same way everywhere — three functions
need the same edit, made correctly, three times.

This is the shape Fowler's chapter 6 calls out directly: the part that is
identical across all three copies is exactly the part that should not be
copied at all.

## The target

**Template Method.** One function defines the five-stage skeleton, once.
Each instrument supplies the *content* of each stage through a small set of
hooks; none of them gets a say in the order, or in whether a stage runs.

When you are done, adding a fourth instrument that fits the five stages should
be one new file — not an edit to the function that runs the night.

## Done when (act 1)

- `./dp test template-method` is green throughout your changes.
- `./dp shape template-method` no longer finds the three duplicated pipeline
  functions.
- There is exactly one place that knows the order of the five stages.
- Each instrument's specific behaviour lives in its own small object, not
  inside a dispatcher.
- Your `git log --oneline` shows more than one commit, each leaving the suite
  green.

## Then run `./dp act2 template-method`

Read [HOW-TO-PRACTICE.md](../../../../docs/HOW-TO-PRACTICE.md) if you have not
yet: this is one of the exercises where the second act does not simply confirm
the pattern was a good idea.

## Hints

<details>
<summary>I can see the duplication but I'm not sure what the hooks should be.</summary>

Write out the five stages as a numbered list for one instrument. Then do the
same for a second one, lined up step by step. Everything that differs between
the two lines is a hook; everything identical is the skeleton.

</details>

<details>
<summary>Should the skeleton be a class with abstract methods, or a function?</summary>

Either is a legitimate reading of this pattern. A function taking an object of
hooks is the shape this repository's [TypeScript notes](../../../../docs/TYPESCRIPT.md)
recommend by default — try that first. If you reach for inheritance instead,
that is a defensible call; say why in your walkthrough.

</details>

<details>
<summary>The three instruments all need to know the current connection and
calibration to do their capture step — how do hooks pass data forward?</summary>

Let the skeleton thread the result of one hook into the next: the return value
of `connect` becomes an argument to `calibrate`, and the return values of both
become arguments to `capture`. The skeleton owns the sequencing of data, same
as it owns the sequencing of calls.

</details>

## Reading

- GoF, *Template Method* — especially *Applicability* and *Consequences*
  (in particular the paragraph on which steps a subclass is allowed to vary).
- Fowler, *Refactoring* (2nd ed.), chapter 6 — the shape this chapter calls
  *Form Template Method*.
- [Template Method on refactoring.guru](https://refactoring.guru/design-patterns/template-method)
