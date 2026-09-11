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
| [`drill-strategy`](./exercises/drills/03-behavioral/strategy/) | Strategy | ●●○ | ~40 min | `essential` | aligned |
| [`drill-template-method`](./exercises/drills/03-behavioral/template-method/) | Template Method | ●●○ | ~35 min | `essential` | ⚠ orthogonal |

---

_2 de 36 exercícios escritos (23 drills · 8 choices · 5 katas)._
