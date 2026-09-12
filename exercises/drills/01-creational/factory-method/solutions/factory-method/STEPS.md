# The route — one factory per kind, one table, three thin call sites

## When to choose this

When more than one call site needs to go from "a kind" to "the right
object," and that mapping is expected to gain members over time. A
single call site with its own switch is not under-designed as a plain
function; this route earns its keep the moment the same decision has to
be made correctly in more than one place.

## What it costs

Following "what does a business-cards job actually construct with" now
means opening `factory.ts`, not the call site you started in. Four small
files (three factories, one table) replace nothing that used to be one
file, because it used to be three near-identical copies of one switch.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `JobFactory` | One abstract method, `createJob(request): PrintJob`. No implementations yet. | `refactor: introduce JobFactory` |
| 2 | Extract `BusinessCardJobFactory` | Moves one branch of the switch into a class. | `refactor: extract BusinessCardJobFactory` |
| 3 | Extract `BrochureJobFactory` | | `refactor: extract BrochureJobFactory` |
| 4 | Extract `BannerJobFactory` | Last of the three. | `refactor: extract BannerJobFactory` |
| 5 | Write `JOB_FACTORIES` and `createJob` | One table mapping every `JobKind` to its factory; `createJob` looks a request's kind up and delegates. | `refactor: introduce createJob` |
| 6 | Route all three call sites through `createJob` | Delete all three switches. | `refactor: route the three call sites through createJob` |

Steps 2-4 extract one factory per commit, each checked against the full
act-1 suite before the next starts - by step 4, the pattern of "one
class, one `createJob` override" is established three times over, so
step 5's table has nothing left to decide except which factory goes with
which kind.

## Then

```bash
./dp act2 factory-method
```

What a fourth job kind costs on this route, and what it would have cost
without the pattern, is in [ACT2.md](./ACT2.md). The full reasoning, with
the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
