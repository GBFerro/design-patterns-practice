# The recommended order

**This is not the order of the folders, and the difference is deliberate.**

The folders follow the GoF taxonomy — creational, structural, behavioral — because that is
the index everybody knows and the way people arrive. A taxonomy is not a curriculum.

Starting with the creational patterns, which is what the book's order implies and what most
courses do, means starting with the most abstract and least motivated ones. Abstract Factory
solves a problem you have not had yet. Factory Method is the first pattern in every tutorial
and is a poor front door: it relieves a coupling you only feel after you have been composing
objects for a while. Taught early, it becomes ceremony.

So: composition first, creation late.

## 1. Varying behaviour

| Pattern | Why here |
| --- | --- |
| Strategy | The cleanest example of "separate what changes from what does not". Everything below is a variation on this idea. |
| Template Method | The same problem solved with inheritance. Meeting it right after Strategy is what makes the trade-off visible. |
| State | Strategy where the strategy changes itself. Do not meet it before Strategy. |
| Command | Behaviour as a value you can queue, undo and compose. |

## 2. Who tells whom

| Pattern | Why here |
| --- | --- |
| Observer | The first pattern about coupling between objects rather than inside one. |
| Mediator | What you reach for when Observer has left you with n² relationships. |
| Chain of Responsibility | Ordered handling, where one link can stop the rest. |

## 3. Wrapping and adapting

| Pattern | Why here |
| --- | --- |
| Adapter | The easiest pattern to motivate and the hardest to overuse. |
| Decorator | Composition stacked. Meet it after Adapter so "wrapping" is already familiar. |
| Facade | Simplifying a surface, not translating one. |
| Proxy | Same interface, different reason. Three patterns share this name; learn all three. |

## 4. Recursive structures

| Pattern | Why here |
| --- | --- |
| Composite | A tree that does not know it is a tree. |
| Iterator | In TypeScript this is a language protocol, not a class you write. |
| Visitor | Only makes sense once Composite exists, and its cost only shows when a node type is added. |

## 5. Creation

| Pattern | Why here |
| --- | --- |
| Factory Method | Now that you have felt the coupling it removes. |
| Builder | Assembly with order and validity rules. |
| Abstract Factory | Families that must not be mixed. The point is the mismatch, not the creation. |
| Prototype | Copying with polymorphism. |

## 6. Narrow cases

| Pattern | Why here |
| --- | --- |
| Memento | Save and restore without exposing internals. |
| Bridge | Two independent axes, both genuinely open. |
| Flyweight | Trading memory for indirection — and the only drill that demands a measurement. |
| Singleton | Verdict `avoid`. The drill teaches what it was protecting and why the road goes elsewhere. |
| Interpreter | *Stretch.* The only pattern with no refactoring.guru page, and the most niche of the 23. |

## Choices and katas

A `choices/` exercise is worth doing as soon as **all** its candidates have been drilled —
the list is in [CHOICES.md](./CHOICES.md). A kata is worth doing when the patterns it needs
exist, and the only way to find that out is to try one and find yourself reaching for
something you have not met.
