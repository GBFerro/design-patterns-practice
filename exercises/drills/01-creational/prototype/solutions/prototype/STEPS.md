# The route — structuredClone over a small prototype registry

## When to choose this

When an object is cloned from a small, known set of starting points, its
fields are ordinary data (no identity, no open resource, nothing that
would be wrong to duplicate), and the set of fields is expected to grow.
A one-off object with a fixed, small, stable shape does not need this -
copying two or three fields by hand is not a smell on its own; it
becomes one only once forgetting a field has already happened, or is
clearly just a matter of time.

## What it costs

Cloning becomes opaque. There is no line of code in `cloneTemplate` that
says what gets copied, which means there is also no line of code to
stop a field that should NOT be deep-copied - an identity, an open
handle, a reference two clones ought to share - from being copied
anyway, silently, exactly like every other field.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Add the ambient declaration | `declare function structuredClone<T>(value: T): T;` at the top of `clone.ts` - the exercise typechecks with no platform lib installed. | `refactor: declare structuredClone as an ambient global` |
| 2 | Replace the manual copy | `cloneTemplate` becomes `return structuredClone(TEMPLATES[name]);` - no field named anywhere. | `refactor: clone templates with structuredClone` |

Two moves, because there is only one function to change and nothing else
in this exercise references a template's fields by name outside it.

## Then

```bash
./dp act2 prototype
```

What adding a field to the template costs on this route, and what it
would have cost without the pattern, is in [ACT2.md](./ACT2.md). The
full reasoning, with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
