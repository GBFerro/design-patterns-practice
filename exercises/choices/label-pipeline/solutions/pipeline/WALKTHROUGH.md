# Walkthrough — Label pipeline at Ravensgate

Read this **after** you have your own version and your own `CHOICE.md`.

---

## The structure

This candidate isn't one of the 23 GoF patterns, so there's no book diagram to map against -
that's the point of offering it as a candidate at all. What it is: a `Stage` is a function
type, `(shipment) -> string | null`, and the label's content is a plain array of `Stage`
values, consumed by mapping every shipment through every stage and dropping the `null`s.

```mermaid
classDiagram
    class Stage {
        <<function type>>
        (shipment) string | null
    }
    class header
    class address
    class weight
    class fragileWarning
    class hazmatWarning
    class customsDeclaration
    class sections {
        <<function>>
    }
    Stage <|.. header
    Stage <|.. address
    Stage <|.. weight
    Stage <|.. fragileWarning
    Stage <|.. hazmatWarning
    Stage <|.. customsDeclaration
    sections ..> Stage : maps every shipment through an array of
```

**On the mapping.** There's nothing to map onto a `Context`/strategy or a `Facade`/subsystem
here - the closest thing this repository already says about this shape is
[`docs/TYPESCRIPT.md`](../../../../../docs/TYPESCRIPT.md)'s note on Chain of Responsibility:
"an array of predicates you reduce over." This candidate is that idea applied to composing
content instead of validating it - `sections()` doesn't reduce to a boolean, it maps to a
list and filters out what doesn't apply. Chain of Responsibility's own defining feature - a
link that can **stop** the chain - has no equivalent here; every stage is asked, none of them
can silence the ones after it. That absence is deliberate: nothing about this domain needs one
section to cancel another.

**On the name.** `Stage`, not `Section` or `Rule`. `Section` fails question 2 from
[`docs/NAMING.md`](../../../../../docs/NAMING.md) - the exercise already uses "section"
informally in prose for the *concept* of one piece of label content, so naming the *function
type* the same word would let two different things answer to one name. `Stage` names the
role: one step a shipment passes through on its way to becoming a rendered line.

**On the name, a second time.** `sections`, not `render` or `build`. `build` collides with
`buildLabel`, the very function that calls it - question 3, does it read well at the call
site - `buildLabel` calling something also named `build` would read as one building the
other, rather than one being assembled from parts. `sections` says what comes back: the list
of content pieces, before either exported function has decided how to join them.

**On the name, a third time.** `stages`, the array, not `pipeline` or `chain`. `pipeline` is
this candidate's own name in the exercise's own README and `meta.json` - reusing it for one
local variable would make every future reference to "the pipeline" ambiguous between "this
candidate" and "this one array." `stages` just names what the array holds.

---

## Why this candidate, over the other two

Both Decorator and Template Method were live options through all of act 1 - either one
produces working code that passes every act-1 test, and `solutions/decorator/` and
`solutions/template-method/` in this repository prove it. What decided it, once act 2
arrived: **a stage's position needed to become conditional on something other than its own
content** - the signature line isn't "does this shipment need a signature," full stop, it's
"does this shipment need a signature, and if so, *where*." A value sitting in an array answers
that with two lines: decide whether to push it, and where. A Decorator's position is fixed
the moment its wrapping is written - moving one to a different spot means restructuring what
it wraps. A Template Method's position is fixed by the order its skeleton method calls its
steps in - moving one means changing the skeleton itself, which every subclass shares. See
[`solutions/decorator/WALKTHROUGH.md`](../decorator/WALKTHROUGH.md) and
[`solutions/template-method/WALKTHROUGH.md`](../template-method/WALKTHROUGH.md) for how each
of those routes actually absorbed the change.

---

## Where TypeScript changes this

There's no `docs/TYPESCRIPT.md` row for this one, because it isn't a GoF pattern - but it's
built from the same material `docs/TYPESCRIPT.md` uses throughout: a function type stands in
for a one-method interface, and a plain array stands in for a fixed sequence of objects. The
"pattern" here, if it has one, is treating **order as data** rather than as control flow -
which is also exactly its cost: nothing stops a caller from building a `stages` array that
lists `weight` twice, or that never includes `header` at all, the way an interface or an
inheritance hierarchy would catch at compile time.

---

## What it cost, even in act 1

- **Nothing enforces that a stage list is complete or sane.** `[header, address, weight,
  fragileWarning, hazmatWarning, customsDeclaration]` is just an array literal - leaving one
  out, or listing one twice, typechecks fine and fails silently until a test catches it.
- **Six small functions instead of one or two classes.** Reading "what does a label contain"
  means reading `stages.ts` top to bottom; that's not a large cost here, but it's a real one
  compared to Decorator's single `renderer.ts` or Template Method's single `label-template.ts`.

## What act 2 showed

See [ACT2.md](./ACT2.md) for the numbers: 23 lines and 2 hunks here, against 41 lines and 4
hunks for Decorator, close to (but fewer hunks than) Template Method's 23 lines and 3 hunks,
and against 24 lines and 3 hunks with no pattern at all. The shape of the win matters as much
as the size: the whole change is "add one stage definition, and conditionally push a reference
to it" - no new class, no new hook, no seam that had to be opened first.
