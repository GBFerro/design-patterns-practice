# Contributing

## The write order — it is not negotiable

Writing the smelly version first produces artificial mess, the kind nobody finds in
production. Un-structuring clean code produces exactly the mess the sources describe.

1. `meta.json`, complete and valid, in one write.
2. The **clean act-1 solution** in `solutions/<slug>/`. `index.ts` is the public boundary.
3. `tests/`, importing **only** from `#exercise`. Green against the solution.
4. Strict lint clean on the solution (if you have oxlint installed).
5. **Absorb act 2 into the solution and MEASURE it.** Write `act2/`, implement the requirement,
   generate `patches/solution-act2.patch`, run `./dp trade`. If act 2 does not fit the budget in
   your own solution, **the exercise is wrong** — the budget is fantasy or the pattern does not
   protect the axis you assumed. Fix it now, before any prose exists. This step exists because
   it catches the fatal defect, and it caught one the first time it was followed.
6. **Build the counterfactual**: `patches/baseline-act2.patch`, the same requirement on the
   act-1 `src/` without the pattern. Measure it too. It must **blow** the budget — if it fits,
   the pattern bought nothing and the exercise proves nothing.
7. Copy the clean code to `src/` and **un-structure it step by step**, running the suite after
   each undo.
8. `STEPS.md`, `WALKTHROUGH.md`, `ACT2.md`, then `README.en.md`.

Both patches are regenerated with:

```bash
git diff --relative=<exercise dir> > <exercise dir>/patches/<name>.patch
```

## The rules the validator enforces

- `patterns` must be exact names from `docs/pattern-names.json`.
- A drill has one solution; a choice has two or more and **exactly one** with `absorbsAct2`.
- Every exercise has `act2/README.en.md` and a non-empty `act2/tests/`.
- Every solution has `index.ts`, `STEPS.md`, `WALKTHROUGH.md` and `ACT2.md`.
- `src/` may **not** be byte-identical to a solution — that is the failure mode of writing the
  clean version first and being interrupted before un-structuring.
- Both patches exist.
- Every relative markdown link resolves. From `solutions/<slug>/` to `docs/` is **six** levels:
  `../../../../../../docs/NAMING.md`. Count them.
- `act2.axis: "orthogonal"` requires the walkthrough to name what *would* have absorbed it.
- No duplicate ids; every `prerequisites` entry exists.

## Copyright — this is a PR criterion, not a footer

The pattern names, the GoF role names and the three categories are shared professional
vocabulary. Everything else in the two sources belongs to their authors, and refactoring.guru
is a paid product.

**Never reuse an example domain from either source.** This is the rule that gets broken without
bad intent, because the analogies are good and they stick. Forbidden, including in disguise:

- the navigation app (Strategy), the social network with posting (Bridge, Abstract Factory)
- the text editor with undo (Command, Memento), the furniture shop (Abstract Factory)
- the notification system (Decorator), the coffee shop with condiments (the universal
  Decorator cliché, not from either source but banned all the same)
- the GoF maze (Abstract Factory, Builder, Prototype) and the Lexi document editor

Also forbidden: transcribing prose beyond one short attributed sentence; the sources'
pseudocode, **including translated to TypeScript**; their illustrations. Reading references are
pointers only — "GoF, *State*, *Consequences*" plus a link.

## Style

- TypeScript strict, no `any`, no `!`.
- The solution passes the strict lint profile: no function over 12 lines, complexity ≤ 5,
  nesting ≤ 2, ≤ 3 parameters. Note this is a **weak** bar here — a pattern passes it by
  construction. It is not evidence that the design is good.
- One dominant pressure per drill. A second unrelated mess is what katas are for.
- Act-1 tests: **one per behaviour a plausible restructuring could silently change**, 5 to 10,
  each with a comment naming the move it guards against. Never aim at a coverage number.
- No UML in a README. The diagram is the answer; it belongs in the walkthrough, twice — once
  with the GoF role names and once with the exercise's real names.

## Issues worth opening

- *new exercise* · *confusing exercise* · *debatable solution* · **debatable verdict**

The last two are where the design discussion happens, and they are the reason the repo is
public. A verdict is an opinion and its walkthrough says what would change it — argue there.
