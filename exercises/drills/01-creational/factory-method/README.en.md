[🌐 English](./README.en.md)

# Factory Method

`Creational` · `Factory Method` · `●●○` · ~30 min

## Context

Thornbury takes print orders three ways: over the counter, as a reprint of
a past job, and as one row of a batch import from a spreadsheet. Each
order names a job kind - business cards, a brochure, or a banner - and
some kind-specific details.

## The pressure

`createJobFromCounter`, `createJobFromReprint` and `createJobFromBatchImport`
each open with the same `switch (request.jobKind)`, constructing the
right job class with the right defaulted fields. Nothing is wrong yet -
nineteen tests pass, and each function reads top to bottom on its own.
What the shape cannot survive is a fourth job kind: it has to be added to
all three switches, correctly, in the same way, and there is nothing
that notices if one of the three is missed.

## The target

**Factory Method.** One small factory class per job kind, looked up by
kind from a single table; the three call sites stop constructing
anything themselves and just ask the table for a job. A new job kind is
one new factory, registered once - not three switches kept in sync by
hand.

## Done when (act 1)

- `./dp test factory-method` is green throughout.
- `./dp shape factory-method` no longer finds `switch (request.jobKind`
  in any of the three call sites.
- `counter.ts`, `reprint.ts` and `batch-import.ts` no longer import any
  concrete job class by name.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 factory-method`

## Hints

<details>
<summary>What's the smallest thing a call site needs to ask for a job?</summary>

One function call: `createJob(request)`. Everything about *which* class
gets built belongs behind that call, not in front of it.

</details>

<details>
<summary>Does each job kind need its own class, or can one class cover all three?</summary>

One class per kind, each overriding a single method (`createJob`) that
returns the right product - GoF's `Creator`/`ConcreteCreator` split.
Parameterizing one class by kind would work too, but then adding a kind
means editing that one class's own logic instead of registering a new
file.

</details>

<details>
<summary>Where does the kind-to-factory mapping live?</summary>

One table, one place: `Record<JobKind, JobFactory>`. Every call site
looks a job kind up in that table and nowhere else.

</details>

## Reading

- GoF, *Factory Method* - the *Intent* section: "define an interface for
  creating an object, but let subclasses decide which class to
  instantiate."
- [Factory Method on refactoring.guru](https://refactoring.guru/design-patterns/factory-method)
