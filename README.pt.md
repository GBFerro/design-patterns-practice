[🌐 English](./README.en.md) · 🇧🇷 **Português**

# design-patterns-practice

Exercícios de design patterns (GoF) em TypeScript. **Todo exercício tem dois atos.**

1. **Ato 1** — o código está sob uma pressão específica. Você reestrutura. A suíte nasce verde e termina verde: o comportamento é preservado.
2. **Ato 2** — `./dp act2 <id>` revela uma mudança que ninguém te contou. Você implementa, e `./dp trade <id>` mede os dois lados da troca: o que a estrutura cobrou, e o que a mudança custou com e sem ela.

Um pattern não é provado por uma suíte verde. É provado pelo custo da segunda mudança — então este repositório mede isso, exercício por exercício, e publica o contrafactual ao lado da resposta.

> **Não oficial.** Sem vínculo com os autores de *Design Patterns* nem com o refactoring.guru. As duas fontes são pré-requisito e não são substituídas por nada aqui. Nenhum texto, pseudocódigo, ilustração ou domínio de exemplo vem delas.

**Roda com zero instalação.** Node 22.6 ou mais novo é o único requisito; o harness é o test runner do próprio Node e o stripping de tipos dele.

```bash
git clone <seu fork> && cd design-patterns-practice
./dp                      # a lista de exercícios
./dp start strategy       # ato 1: o enunciado e a suíte em watch
./dp act2 strategy        # ato 2: a mudança que você não sabia
./dp trade strategy       # pagou × comprou, contra o orçamento declarado
```

- [O catálogo](./docs/CATALOG.md) — os 23 patterns, cada um com um veredito
- [Como praticar](./docs/HOW-TO-PRACTICE.md)
- [A ordem recomendada](./docs/PATH.md) — que **não** é a ordem das pastas
- [O que o TypeScript já resolveu](./docs/TYPESCRIPT.md)
- [Notas de design](./docs/DESIGN.md) · [Roadmap](./docs/ROADMAP.md) · [Contribuindo](./CONTRIBUTING.md)

## Drills — o pattern é nomeado

| Id | Pattern | Dificuldade | Tempo | Veredito | Eixo do ato 2 |
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

## Choices — você escolhe, e o ato 2 decide

| Id | Pattern | Dificuldade | Tempo | Veredito | Eixo do ato 2 |
| --- | --- | --- | --- | --- | --- |
| [`choice-carrier-gateway`](./exercises/choices/carrier-gateway/) | Carrier gateway | ●●● | ~40 min | `-` | aligned |
| [`choice-crate-config`](./exercises/choices/crate-config/) | Crate config | ●●○ | ~35 min | `-` | aligned |
| [`choice-label-pipeline`](./exercises/choices/label-pipeline/) | Label pipeline | ●●● | ~40 min | `-` | aligned |
| [`choice-order-events`](./exercises/choices/order-events/) | Order events | ●●● | ~40 min | `-` | aligned |
| [`choice-package-tree`](./exercises/choices/package-tree/) | Package tree | ●●● | ~40 min | `-` | aligned |
| [`choice-picking-policy`](./exercises/choices/picking-policy/) | Picking policy | ●●● | ~40 min | `-` | aligned |
| [`choice-surcharge-rules`](./exercises/choices/surcharge-rules/) | Surcharge rules | ●●● | ~40 min | `-` | ⚠ orthogonal |
| [`choice-warehouse-registry`](./exercises/choices/warehouse-registry/) | Warehouse registry | ●●○ | ~30 min | `-` | aligned |

---

_31 de 36 exercícios escritos (23 drills · 8 choices · 5 katas)._
