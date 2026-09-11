[🌐 English](./README.en.md)

# Strategy

`Behavioral` · `Strategy` · `●●○` · ~40 min

## Context

Hollowell Observatory has one 1.2-metre telescope and far more approved proposals than
nights. Every evening a script turns the night's approved requests into a plan: an ordered
list of observations that fits the hours of darkness. Which requests make the cut depends
on what the observatory is optimising for that semester, and the committee changes its mind
about that roughly once a year.

## The pressure

`planNight` has grown a `switch` with one branch per way of ordering the queue, and each
branch carries its own full pass over the night: it filters out targets below the dome
wall, walks the candidates, checks them against the budget and works out when each one
starts. Three copies of the same night, with a different comparator buried in each.

Nothing in that code is wrong. What is wrong is that **the part that never changes and the
part that changes every year are braided together**, so the only way to add a way of
ordering the queue is to edit the function that all three existing ones depend on. Fowler's
chapter 3 has a name for the shape: the `switch` is the symptom, and the duplicated pass is
the cost.

A list of policy names sits at the top of the file, the error message repeats it in prose,
and the `switch` repeats it a third time. Nothing keeps the three in step.

The committee meets again before the next semester. Assume something will change; do not
assume you know what.

## The target

**Strategy.** Separate the one thing that varies — the order in which candidates are
offered — from everything that does not. When you are done, the night should be described
in exactly one place, and a way of ordering the queue should be a thing you can hold on its
own: named, testable in isolation, and addable without reopening the night.

The three orderings must keep behaving exactly as they do now. That is what the suite is
for.

## Done when (act 1)

- `./dp test strategy` is green — it was green before you started and it never went red for
  longer than it took you to undo something.
- `./dp shape strategy` no longer finds the `switch` on the policy name.
- There is exactly one place that knows what "the night" means: the horizon, the budget,
  the start times and the skipped list.
- There is exactly one place that knows which policies exist. The error message and the
  dispatch cannot drift apart any more because they read the same list.
- Your `git log --oneline` has more than one commit, and each one left the suite green.
- If you have the optional tools installed: `npx oxlint -c .oxlintrc.strict.json` is clean
  on what you wrote — no function over 12 lines, complexity at most 5, nesting at most 2,
  at most 3 parameters.

## Then run `./dp act2 strategy`

The exercise is not over when the suite is green. It is over when you know what the
restructuring bought you, and `./dp trade strategy` puts a number on it.

## Hints

<details>
<summary>I can see the duplication but not where to cut.</summary>

Write down, for each of the three branches, which lines differ. You will find that the
answer is "one comparator, and in one case the way the candidates are grouped". Everything
else is the same night three times.

That difference is the thing that wants to become an object. Everything identical is the
thing that wants to become *one* function.

</details>

<details>
<summary>What should the varying thing actually do?</summary>

Resist giving it the whole job. It is tempting to hand it the budget and let it return the
plan — then each policy re-implements the night and you have three copies again behind an
interface, which is worse than the `switch` because it looks organised.

Ask instead: what is the smallest question whose answer differs between the three? All
three can be expressed as *a total ordering of the candidates*. Even the fair one: give
every proposal its first slot, then every proposal its second, and you have an ordering.

</details>

<details>
<summary>I have the orderings separated and the `switch` is still there, just smaller.</summary>

A `switch` that maps a string to an object is still a place you have to edit. Who should
own the list of available policies?

Put the name *on* the policy, gather the policies in one collection, and look up by name.
Now adding one is appending to a collection, and the error message can list what is
actually available instead of what somebody remembered to write down.

</details>

## Reading

- GoF, *Strategy* — especially *Applicability* and *Consequences*.
- Fowler, *Refactoring* (2nd ed.), chapter 10 — *Replace Conditional with Polymorphism*
  is the move that gets you most of the way here.
- [Strategy on refactoring.guru](https://refactoring.guru/design-patterns/strategy)
