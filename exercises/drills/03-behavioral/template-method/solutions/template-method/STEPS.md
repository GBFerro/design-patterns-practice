# The route — a shared pipeline function taking instrument hooks

## When to choose this

When several procedures share an **identical sequence of stages** and differ only
in what each stage does. Here that sequence is connect → calibrate → capture →
download → disconnect, and it is the same for every instrument that has ever been
added.

## What it costs

One function and one interface replace three functions. Adding an instrument that
fits the five stages becomes one new file. The cost shows up the moment an
instrument needs to do something the five stages did not anticipate — see
[ACT2.md](./ACT2.md): this pattern makes the expected extension (a new instrument)
cheap and an unexpected *kind* of extension (skipping a stage) more expensive than
doing nothing at all would have been.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Line up the three copies | Reformat all three functions so each of the five `steps.push` calls sits on the same relative line. Behaviour unchanged. | `refactor: align the three pipelines stage by stage` |
| 2 | Name what each stage returns | Give each stage's intermediate value a one-word name (`port`, `reference`, `frames`/`exposureSeconds`) — they already have these names; this step is about confirming the three instruments produce the *same shape* of value per stage. | `refactor: confirm the five stages return the same shape per instrument` |
| 3 | Extract the hooks type | Write `InstrumentHooks` with one method per stage, typed from what step 2 found. | `refactor: introduce InstrumentHooks` |
| 4 | Extract the skeleton | Write `runPipeline(hooks, target)`: the five stages, in order, threading each stage's result into the next. Do not touch the three pipeline functions yet — write this standalone and test it with an inline hooks object. | `refactor: extract runPipeline` |
| 5 | Turn each pipeline function into a hooks object | One at a time: wrap the instrument-specific lines of each function into an `InstrumentHooks` object, and replace the call site with `runPipeline(hooks, target)`. Run the suite after each of the three. | `refactor: turn each pipeline into an InstrumentHooks object` (×3) |
| 6 | One file per instrument | Move each hooks object into its own file under `instruments/`. | `refactor: one file per instrument` |
| 7 | Replace the switch with a lookup | `instruments/registry.ts` holds the list; `findInstrument` looks up by name and throws with the full list on a miss. | `refactor: replace the instrument switch with a registry` |

Step 4 is the one to get right before touching the three functions: write
`runPipeline` against a hand-built hooks object first, and confirm it produces
the same `NightLog` shape an existing function does, *before* you delete any
duplication. That way a mistake in the skeleton shows up against one known-good
comparison instead of three simultaneous rewrites.

## Then

```bash
./dp act2 template-method
```

What act 2 asks for, and why this pattern does not clearly win it, is in
[ACT2.md](./ACT2.md). The reasoning behind each step, and the diagram mapping
this exercise onto the GoF roles, is in [WALKTHROUGH.md](./WALKTHROUGH.md).
