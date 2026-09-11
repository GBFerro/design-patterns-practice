# Exercise roadmap — design-patterns-practice

One world per layer, one sub-domain per exercise, so no two exercises feel like the same
program twice. Nothing here comes from the sources: the domains are original, and the
blacklist in DESIGN.md §16 names the ones that are off limits — including the ones that are
tempting because they are good.

Ids are pattern slugs for drills (`drill-state`, resolved fuzzily from `state`), domain slugs
for choices (`choice-picking-policy`) and numbers for katas.

**Every exercise has two acts.** The `Act 1 pressure` column is what hurts on arrival; the
`Act 2` column is the change that arrives afterwards and decides whether act 1 paid for
itself. `Axis` says whether act 2 comes along the axis the pattern protects (`aligned`) or a
different one (`orthogonal`) — the orthogonal ones are the most valuable exercises in the
repo and are marked ⚠.

---

## Module 1 — Creational · *Thornbury Print Works*

A print shop: two incompatible families of presses, quotes assembled from optional stages,
document templates cloned for every job.

| Id | Pattern | Verdict | Sub-domain | Act 1 pressure | Act 2 | Axis |
| --- | --- | --- | --- | --- | --- | --- |
| factory-method | Factory Method | essential | order intake | `switch (jobKind)` constructing job objects inline, repeated in three call sites | A fourth job kind (foil stamping) arrives | aligned |
| abstract-factory | Abstract Factory | situational | press configuration | Two machine families (digital, offset) whose parts must never be mixed; today a runtime error is the only guard | A third family (wide-format) whose parts overlap in name with offset | aligned |
| builder | Builder | essential | quote assembly | A 9-parameter constructor, 4 optional, two combinations that are invalid and unchecked | A new optional stage **and** a new validity rule spanning two stages | aligned |
| prototype | Prototype | situational | job templates | A template deep-copied field by field; one field was forgotten and the bug is in the suite | A field is added to the template | aligned |
| singleton | Singleton | **avoid** | press-room settings | A textbook lazy singleton read from five modules; one test cannot be isolated because of it | The suite needs two configurations live in the same run | aligned |

Notes for the writer:

- `builder` must resist the fluent-interface reflex. In TypeScript the object literal covers
  most of it; the builder earns its keep when stages are **ordered** or the product is
  validated once at `build()`. The second solution variant is the literal, and it is not a
  straw man.
- `singleton`'s solution folder is `module-and-injection/`, not `singleton/`. The walkthrough
  owes the reader the paragraph from DESIGN.md §9.2: when would the singleton still be the
  least bad answer?

---

## Module 2 — Structural · *Caldermoor Transit Authority*

A transit network: stops and lines composing into journeys, fare media from three decades,
an expensive vehicle-position service.

| Id | Pattern | Verdict | Sub-domain | Act 1 pressure | Act 2 | Axis |
| --- | --- | --- | --- | --- | --- | --- |
| adapter | Adapter | essential | fare-card readers | A legacy reader whose interface does not match what the new turnstile expects | A second legacy reader, with a third shape | aligned |
| bridge | Bridge | situational | fare calculation | Two independent axes — fare policy × payment medium — multiplied into a class explosion | One new value **on each axis** (proves multiplicative vs additive cost) | aligned |
| composite | Composite | essential | the network | Stops, segments, lines and journeys totalled by a recursive function full of `instanceof` | A new node kind: a walking transfer | aligned |
| decorator | Decorator | essential | fare modifiers | Student, off-peak and group-cap flags threaded as booleans through one function | A new modifier **plus a required ordering constraint** between two of them ⚠ | orthogonal |
| facade | Facade | essential | trip planning | A client coordinating five subsystems in a specific order, duplicated in two places | Two subsystems change their internals and one is replaced | aligned |
| flyweight | Flyweight | niche | timetable rendering | 200k stop-time objects each carrying its own copy of the stop metadata | An allocation budget, measured — not a functional requirement | aligned |
| proxy | Proxy | situational | vehicle positions | An expensive remote lookup called in a loop | Access control added, with zero edits to caller or subject | aligned |

Notes for the writer:

- `decorator`'s act 2 is deliberately orthogonal and it is the best exercise in the module:
  Decorator makes "add a modifier" free and makes "guarantee an order between modifiers"
  *worse*. The walkthrough must name what would have absorbed it (an ordered pipeline with an
  explicit stage list) and must not pretend the pattern won.
- `flyweight` is the one exercise that **requires a measurement**. Allocation count before and
  after, in the suite. A Flyweight exercise without a number is cargo cult (DESIGN.md §9).
- `proxy` should make the three proxies explicit in the walkthrough — virtual, protection and
  remote are three patterns sharing one name, and the act 2 moves from the first to the second
  on purpose.

---

## Module 3 — Behavioral · *Hollowell Observatory* — **the pilot module**

A small observatory: scheduling policies, a telescope with a lifecycle, instruments driven by
queued commands, alerts fanning out to consumers.

| Id | Pattern | Verdict | Sub-domain | Act 1 pressure | Act 2 | Axis |
| --- | --- | --- | --- | --- | --- | --- |
| strategy | Strategy | essential | scheduling policy | Three scheduling policies selected by a `switch`, sharing a body nobody dares touch | A fourth policy, configured by name from a file | aligned |
| template-method | Template Method | essential | nightly pipeline | Three instrument pipelines sharing a skeleton, with four duplicated steps between them | A new instrument, then **a step one instrument must skip** ⚠ | orthogonal |
| state | State | essential | telescope lifecycle | `parked / slewing / tracking` checked with `if (status === …)` across four methods; one illegal transition is reachable | A fourth state (`fault`) and a transition that must be refused | aligned |
| command | Command | essential | instrument control | A queue of action records dispatched by a `switch`, with no way to undo | Undo/redo, then macro (a command made of commands) | aligned |
| observer | Observer | essential | alert distribution | Seeing and weather alerts pushed by direct calls to four consumers | A new consumer, unsubscribe, **and one consumer throwing must not stop the others** | aligned |
| mediator | Mediator | situational | control-room panel | Six widgets each holding references to the others; n² coupling, and two update loops | A seventh widget, and one existing interaction must be removed | aligned |
| chain-of-responsibility | Chain of Responsibility | situational | request validation | Six validation clauses in one `if` chain where order matters and one must be skippable per telescope | A rule inserted in the middle, and the order changed for one telescope | aligned |
| iterator | Iterator | essential | observation log | Paged log storage, with callers doing index arithmetic and off-by-one bugs | A second traversal order, and a lazy sequence that must not load everything | aligned |
| visitor | Visitor | situational | reduction reports | Three reports, each added as a method on every node class of the log hierarchy | A fourth report (cheap) **and then a new node type** (expensive — the honest cost) ⚠ | orthogonal |
| memento | Memento | situational | exposure setup | Save/restore where the restorer currently reads and writes the internals directly | A field added to the saved state, with zero edits to the caretaker | aligned |
| interpreter | Interpreter | niche (*stretch*) | observation constraints | `altitude > 30 && moon_phase < 0.3` parsed with string matching and three special cases | A new operator and a new term | aligned |

Notes for the writer:

- `iterator` implements **`Symbol.iterator` and generators**, never `hasNext()/next()`. The
  walkthrough shows the GoF diagram and maps it onto the language protocol. This drill is the
  clearest case of DESIGN.md §10 and is worth writing early.
- `strategy` and `command` are the two drills with two legitimate solution variants (class and
  function). Write the class one first; come back only when the function one has something of
  its own to say.
- `visitor`'s act 2 is two-sided on purpose: the fourth report proves the pattern, the new node
  type proves its price. Both numbers go in `ACT2.md`.
- `interpreter` is the only drill with no refactoring.guru page to check against. Cite GoF only,
  and say so in the reading section.

---

## Choices · *Ravensgate Fulfilment*

A fulfilment operation — picking, packing, labelling, carriers, surcharges. Chosen because it
is unusually rich in **independent axes of change**, which is what this layer needs.

Named by domain, never by the candidates (DESIGN.md §4). Candidates are listed in the README.
**"None" is a candidate in four of the eight**, and nothing in the path says which.

| Id | Sub-domain | Candidates | What act 2 discriminates |
| --- | --- | --- | --- |
| picking-policy | how pickers are routed through the warehouse | Strategy · State · Template Method | Whether the behaviour depends on a **mode that itself transitions** — if it does, Strategy leaks the mode into the caller |
| carrier-gateway | talking to three carrier APIs | Adapter · Proxy · Facade | Whether the interface must stay **identical** (proxy), be translated (adapter), or be simplified (facade). Act 2 adds caching, which only one of the three absorbs without a new name |
| label-pipeline | composing the content of a shipping label | Decorator · Template Method · **a pipeline of functions** | Act 2 needs a stage to be **reordered and conditional**. The function pipeline wins; Decorator is the trap here |
| order-events | who finds out when an order ships | Observer · Mediator · Chain of Responsibility | Whether consumers are independent (observer), need to coordinate (mediator), or form an ordered chain where one can stop the rest |
| package-tree | totalling weight and volume of nested cartons | Composite · Visitor · **plain recursion** | Act 2 adds a second kind of traversal **and** a new node type, which is exactly where the three diverge |
| crate-config | building a crate specification | Builder · Abstract Factory · **an object literal** | Act 2 adds an optional field and a cross-field rule. The literal plus a validator absorbs both; the builder pays ceremony for nothing |
| surcharge-rules | fuel, remote-area and oversize surcharges | Strategy · **a lookup table** · a rules list | Act 2 adds a surcharge that depends on **two** existing ones, which the table expresses and Strategy hides ⚠ |
| warehouse-registry | one shared list of bin locations | Singleton · a module · injection | Act 2 needs two registries live in the same process (tests, and a second site) |

The `CHOICES.md` index is generated by inverting this table: for each pattern, which choice
exercises list it as a candidate. That index helps without giving anything away.

---

## Katas

Larger code (250–500 lines), no candidates listed, two acts, 2+ published routes each.

| Id | Domain | Ships with tests? | The shape of it |
| --- | --- | --- | --- |
| kata-01 | Ravensgate returns and refunds engine | yes | Three pressures overlapping; the published routes disagree about which to relieve first |
| kata-02 | Rate shopping across carriers | **no** — write the net first | The net is the exercise; the structure is the second half |
| kata-03 | Warehouse robot command stream | yes | Undo, replay and a failed command mid-batch |
| kata-04 | Invoice and surcharge engine | **no** — write the net first | Cross-cutting: creation, variation and notification in one file |
| kata-05 | Legacy WMS integration | **no** — write the net first | **The best published route uses no pattern at all**, and the kata does not announce it |

`kata-05` is the one that makes the repository honest. It sits in the same directory as the
others, with the same README shape, and the reader has no way to know until they have
measured it.

---

## Counts

23 drills · 8 choices · 5 katas = **36 exercises**.

With two acts each, and the rule that every non-absorbing solution owes a measured cost
section, the real size is: 36 act-1 suites, 36 act-2 suites, ~50 solution folders, and ~50
`WALKTHROUGH.md` + `ACT2.md` pairs. That is the number that describes the project, and the
reason Phase 2 (DESIGN.md §17) is the gate: eleven behavioral drills, solved without reading
a single `act2/` early, is what proves the format.
