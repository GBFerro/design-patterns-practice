🌐 **English** · [🇧🇷 Português](./README.pt.md)

# design-patterns-practice

Hands-on TypeScript exercises for the 23 GoF design patterns. **Every exercise has two acts.**

1. **Act 1** — the code is under a specific pressure. You restructure it. The suite is green before you start and green when you finish: behaviour is preserved.
2. **Act 2** — `./dp act2 <id>` reveals a change nobody told you about. You implement it, and `./dp trade <id>` measures both sides of the bargain: what the structure cost you, and what the change cost with it and without it.

A pattern is not proven by a green suite. It is proven by what the second change costs — so this repository measures that, exercise by exercise, and publishes the counterfactual next to the answer.

> **Unofficial.** No connection to the authors of *Design Patterns* or to refactoring.guru. Both are prerequisites, not replaced by anything here. No text, pseudocode, illustration or example domain is taken from either.

**It runs with zero install.** Node 22.6 or newer is the only requirement; the harness is Node's own test runner and its TypeScript stripping.

```bash
git clone <your fork> && cd design-patterns-practice
./dp                      # the exercise list
./dp start strategy       # act 1: the brief, and the suite in watch mode
./dp act2 strategy        # act 2: the change you were not told about
./dp trade strategy       # paid × bought, against the declared budget
```

- [The catalogue](./docs/CATALOG.md) — the 23 patterns, each with a verdict
- [How to practise](./docs/HOW-TO-PRACTICE.md)
- [The recommended order](./docs/PATH.md) — which is *not* the folder order
- [What TypeScript already solved](./docs/TYPESCRIPT.md)
- [Design notes](./docs/DESIGN.md) · [Roadmap](./docs/ROADMAP.md) · [Contributing](./CONTRIBUTING.md)

## Drills — the pattern is named

| Id | Pattern | Difficulty | Time | Verdict | Act 2 axis |
| --- | --- | --- | --- | --- | --- |
| [`drill-abstract-factory`](./exercises/drills/01-creational/abstract-factory/) | Abstract Factory | ●●● | ~35 min | `situational` | aligned |
| [`drill-builder`](./exercises/drills/01-creational/builder/) | Builder | ●●○ | ~35 min | `essential` | ⚠ orthogonal |
| [`drill-factory-method`](./exercises/drills/01-creational/factory-method/) | Factory Method | ●●○ | ~30 min | `essential` | aligned |
| [`drill-prototype`](./exercises/drills/01-creational/prototype/) | Prototype | ●●○ | ~30 min | `situational` | aligned |
| [`drill-singleton`](./exercises/drills/01-creational/singleton/) | Singleton | ●●○ | ~30 min | `avoid` | aligned |
| [`drill-adapter`](./exercises/drills/02-structural/adapter/) | Adapter | ●●○ | ~30 min | `essential` | aligned |
| [`drill-bridge`](./exercises/drills/02-structural/bridge/) | Bridge | ●●● | ~35 min | `situational` | aligned |
| [`drill-composite`](./exercises/drills/02-structural/composite/) | Composite | ●●○ | ~30 min | `essential` | aligned |
| [`drill-decorator`](./exercises/drills/02-structural/decorator/) | Decorator | ●●● | ~30 min | `essential` | ⚠ orthogonal |
| [`drill-facade`](./exercises/drills/02-structural/facade/) | Facade | ●●○ | ~30 min | `essential` | aligned |
| [`drill-flyweight`](./exercises/drills/02-structural/flyweight/) | Flyweight | ●●○ | ~30 min | `niche` | aligned |
| [`drill-proxy`](./exercises/drills/02-structural/proxy/) | Proxy | ●●○ | ~30 min | `situational` | aligned |
| [`drill-chain-of-responsibility`](./exercises/drills/03-behavioral/chain-of-responsibility/) | Chain of Responsibility | ●●● | ~40 min | `situational` | aligned |
| [`drill-command`](./exercises/drills/03-behavioral/command/) | Command | ●●● | ~40 min | `essential` | aligned |
| [`drill-interpreter`](./exercises/drills/03-behavioral/interpreter/) | Interpreter | ●●● | ~40 min | `niche` | aligned |
| [`drill-iterator`](./exercises/drills/03-behavioral/iterator/) | Iterator | ●●○ | ~30 min | `essential` | aligned |
| [`drill-mediator`](./exercises/drills/03-behavioral/mediator/) | Mediator | ●●● | ~45 min | `situational` | aligned |
| [`drill-memento`](./exercises/drills/03-behavioral/memento/) | Memento | ●●○ | ~30 min | `situational` | aligned |
| [`drill-observer`](./exercises/drills/03-behavioral/observer/) | Observer | ●●○ | ~35 min | `essential` | aligned |
| [`drill-state`](./exercises/drills/03-behavioral/state/) | State | ●●● | ~45 min | `essential` | aligned |
| [`drill-strategy`](./exercises/drills/03-behavioral/strategy/) | Strategy | ●●○ | ~40 min | `essential` | aligned |
| [`drill-template-method`](./exercises/drills/03-behavioral/template-method/) | Template Method | ●●○ | ~35 min | `essential` | ⚠ orthogonal |
| [`drill-visitor`](./exercises/drills/03-behavioral/visitor/) | Visitor | ●●● | ~45 min | `situational` | ⚠ orthogonal |

## Choices — you pick, and act 2 decides

| Id | Pattern | Difficulty | Time | Verdict | Act 2 axis |
| --- | --- | --- | --- | --- | --- |
| [`choice-carrier-gateway`](./exercises/choices/carrier-gateway/) | Carrier gateway | ●●● | ~40 min | `-` | aligned |
| [`choice-label-pipeline`](./exercises/choices/label-pipeline/) | Label pipeline | ●●● | ~40 min | `-` | aligned |
| [`choice-picking-policy`](./exercises/choices/picking-policy/) | Picking policy | ●●● | ~40 min | `-` | aligned |

---

_26 of 36 exercises written (23 drills · 8 choices · 5 katas)._
