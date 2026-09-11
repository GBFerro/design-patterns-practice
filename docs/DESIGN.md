# design-patterns-practice — Documento de Design

> Repositório de exercícios de design patterns em TypeScript, derivado de
> *Design Patterns: Elements of Reusable Object-Oriented Software* (Gamma, Helm, Johnson,
> Vlissides, 1994) e do catálogo de [refactoring.guru](https://refactoring.guru/design-patterns/catalog).
> Este documento define **como o repositório é organizado e por quê**. Nenhum código foi
> escrito ainda.

- **Status:** design aprovado, implementação adiada (ver §17)
- **Stack:** TypeScript (strict) + Vitest + npm workspaces — a mesma do `refactoring-practice`
- **Formato do exercício:** **dois atos** — você reestrutura, e depois a segunda mudança chega
- **Destino:** repositório público no GitHub
- **Irmão:** `refactoring-practice`, de onde vem todo o tooling (§8)

---

## 1. Escopo e decisões de partida

Três decisões herdadas do `refactoring-practice` e não reabertas aqui:

- **Um repositório por fonte**, com tooling compartilhado via `book-practice-template`
  (§1 do design do `refactoring-practice`). Nome: `design-patterns-practice`.
- **TypeScript strict + Vitest + oxlint + oxfmt.** Reaproveita `./rp` inteiro (§8).
- **Inglês obrigatório, pt-BR opcional** nos enunciados. Os nomes dos patterns e dos papéis
  (`Context`, `ConcreteStrategy`, `Originator`) ficam sempre em inglês: são o vocabulário
  compartilhado da profissão.

Uma decisão nova, sobre a fonte. São **duas** fontes com pesos diferentes:

| Fonte | O que se usa dela | O que não se usa |
| --- | --- | --- |
| GoF (1994) | Os 23 nomes, os papéis da estrutura, a intenção de cada pattern, a seção *Consequences* como referência de leitura | O texto, os diagramas, os exemplos em C++/Smalltalk, o editor Lexi, o labirinto |
| refactoring.guru | O agrupamento em 3 categorias, a seção *Relations with Other Patterns* como mapa das vizinhanças (é a melhor coisa do site e a base da camada `choices/`, §5.2) | A prosa, as analogias, o pseudocódigo, e **sobretudo os domínios de exemplo** (§16) |

**Interpreter existe só no GoF.** O refactoring.guru cobre 22 patterns e não tem página de
Interpreter (confirmado: 404). Isso tem consequência prática — é o único drill sem a
segunda fonte para conferir, e é também o mais nichado. Ele entra marcado como *stretch*
(§18), e o `CATALOG.md` registra a ausência em vez de escondê-la.

**Descrição do repo:** *Hands-on TypeScript exercises for the GoF design patterns — each
one in two acts: restructure the code, then find out what the next change actually costs.*

---

## 2. Por que praticar patterns não é praticar refactoring

Essa é a decisão central, e ignorá-la produziria um clone morno do repositório anterior.

No `refactoring-practice` o exercício funciona porque um refactoring é um **movimento
mecânico**: *Extract Function* tem um antes, um depois e uma invariante verificável — os
testes continuam verdes. Existe um movimento certo, e a suíte prova que você o fez sem
quebrar nada.

Design patterns não têm nada disso:

1. **Não existe "o movimento certo".** Strategy, State e Template Method resolvem o mesmo
   sintoma com três custos diferentes. A pergunta difícil não é *como* implementar — é
   *qual*, e frequentemente *se*.
2. **Testes verdes não dizem quase nada.** Você pode implementar Strategy errado e a suíte
   passa. Pode implementar certo e o pattern era desnecessário — a suíte também passa. O
   sucesso de um pattern não é observável no comportamento; é observável no **custo da
   próxima mudança**.
3. **O modo de falha dominante é o excesso, não a falta.** Ninguém em produção sofre por
   não ter aplicado Abstract Factory. Sofre-se por três camadas de indireção construídas
   para uma variação que nunca chegou. Um repositório que só treina *aplicar* patterns
   treina exatamente o vício.
4. **A linguagem mudou desde 1994.** Em TypeScript, metade dos patterns comportamentais
   colapsa numa função, Iterator é um protocolo da linguagem e Singleton é um módulo. Um
   exercício que faz você escrever `hasNext()/next()` à mão ensina história, não desenho.

Portanto: o formato do exercício, a invariante central e o critério de pronto precisam ser
**diferentes**. O que se reaproveita do repo anterior é o tooling (§8), não a pedagogia.

---

## 3. A invariante central: o teste da segunda mudança

A afirmação de todo design pattern é uma previsão falsificável:

> *"Quando a próxima mudança do tipo X chegar, ela vai custar um arquivo novo em vez de uma
> edição espalhada."*

Isso é mensurável. Então o exercício tem **dois atos**, e o segundo é o que avalia o primeiro.

### Ato 1 — a reestruturação

`src/` tem código sob uma pressão específica. `tests/` nasce verde e é imutável — aqui a
regra do `refactoring-practice` vale inteira: **o comportamento é preservado**. Você
reestrutura. Ao terminar, você comita.

### Ato 2 — a segunda mudança

`./dp act2 <id>` revela um requisito novo: um fragmento de enunciado e uma suíte adicional
em `act2/tests/`. Você implementa. `tests/` **e** `act2/tests/` ficam verdes.

E aí vem a parte que não existe no repositório anterior:

### `./dp trade <id>` — os dois números

O comando mede o diff do ato 2 contra o commit do fim do ato 1 e imprime os dois lados da
troca:

```
Pagou (ato 1):      +3 arquivos · +1 interface · +1 nível de indireção
Comprou (ato 2):    +1 arquivo · 0 arquivos existentes editados · 0 linhas alteradas
Orçamento:          ≤ 1 arquivo existente, ≤ 3 linhas        ✓ dentro
```

**Esse par de números é a tese do repositório.** Todo exercício mostra os dois lados. Um
pattern não é "bom" — é uma compra, com preço e com mercadoria, e o exercício coloca os
dois na mesma tela.

O orçamento vive no `meta.json`:

```json
"extensionBudget": { "maxFilesModified": 1, "maxLinesModified": 3, "filesAdded": "any" }
```

Três consequências que valem registrar:

- **O "done when" deixa de ser uma opinião.** "Adicionar uma política nova não deve exigir
  tocar em nada existente" é checável, e é o que o enunciado promete.
- **Os exercícios-armadilha ficam mensuráveis.** Num exercício cuja resposta certa é "nenhum
  pattern", o ato 2 é absorvido igualmente barato pelo código simples — e o orçamento prova
  que a abstração teria sido peso morto.
- **Os exercícios de eixo errado passam a existir.** Em alguns, o ato 2 muda ao longo de um
  eixo **diferente** do que o pattern protege: você montou Strategy para variar o algoritmo,
  e o ato 2 adiciona um *passo* a todos os algoritmos — o que Strategy piora e Template
  Method teria absorvido. Isso ensina a única coisa que nenhum tutorial ensina: **um pattern
  compra flexibilidade num eixo e cobra nos outros.** Declarado no `meta.json` como
  `"act2Axis": "orthogonal"`, e são os exercícios mais valiosos do repo.

### Onde o ato 2 mora, e por que ele é visível

`act2/` está commitado. Qualquer pessoa pode `cat exercises/.../act2/README.en.md` antes de
começar. Isso é deliberado, e é a mesma postura do §9.1 do repo anterior: **a trava é um
empurrão, não uma cadeia.** O `./dp act2` sequencia a revelação; não a protege. O
`HOW-TO-PRACTICE.md` diz isso em voz alta, porque fingir o contrário seria mentir sobre um
repositório público.

Mecanicamente, `act2/tests/` entra na execução só com `ACT=2` — exatamente o mecanismo que o
§17 do `refactoring-practice` já criou para `tests-fixed/`. O precedente existe e funciona.

`./dp act2` grava o `HEAD` atual em `.dp/act2-base` (não versionado), que é a base do `trade`.

---

## 4. O que um exercício **não** pode conter

O corolário do §3 é uma regra de spoiler mais severa que a do repo anterior, porque aqui a
resposta é mais fácil de vazar:

| Artefato | Onde pode aparecer | Por quê |
| --- | --- | --- |
| O diagrama UML do pattern | Só no `WALKTHROUGH.md` | **O diagrama é a resposta.** GoF ensina por diagrama; colocá-lo no enunciado transforma o exercício em transcrição. |
| O nome do pattern | No enunciado dos `drills/`; **nunca** nos `choices/` e `katas/` | Nos drills o nome é o alvo declarado. Nas outras camadas, nomear é resolver. |
| Os nomes dos papéis (`Context`, `Handler`) | `WALKTHROUGH.md` | Mesma razão do diagrama. |
| O requisito do ato 2 | `act2/`, revelado por comando | É o gabarito da decisão do ato 1 (§5.2). |

Daí uma decisão de estrutura que parece pequena e não é: **não existe diretório `traps/`.**
Um exercício cuja resposta é "nenhum pattern" dentro de uma pasta chamada `traps/` já foi
respondido pelo caminho do arquivo. As armadilhas moram em `choices/`, indistinguíveis das
demais. Pela mesma razão os exercícios de `choices/` são nomeados **pelo domínio**, nunca
pelos patterns candidatos.

---

## 5. As três camadas

### 5.1 `drills/` — o pattern nomeado

O enunciado diz qual pattern aplicar. O código do ato 1 (80–180 linhas) está sob a pressão
que o pattern existe para aliviar, e o ato 2 chega pelo eixo que ele protege. Um drill por
pattern: **23**.

O objetivo é fluência: reconhecer a forma, saber os papéis, escrever a estrutura sem
consultar. E, como todo drill tem ato 2, também: ver o pattern pagar.

Drill → **exatamente uma** pasta de solução, com uma exceção de propósito: os patterns que
em TypeScript têm duas formas legítimas (Strategy e Command em classe *ou* em função,
Template Method em herança *ou* em composição de funções) trazem **duas**, e o trade-off
entre elas é a lição (§10). Declarado por `"variants": "language"` no `meta.json`.

### 5.2 `choices/` — a escolha entre vizinhos

A camada que justifica o repositório, e a que não existe em nenhum tutorial.

O enunciado descreve um domínio, uma pressão e **lista 2 a 4 candidatos** — às vezes
incluindo "nenhum pattern". Não diz qual. Você escolhe, justifica **por escrito antes de ver
o ato 2**, implementa, e então o ato 2 chega escolhido exatamente para discriminar: um
candidato o absorve barato, o outro não.

```bash
./dp choose picking-policy --pattern state --because "o comportamento depende do modo, e o modo transita"
# grava CHOICE.md na sua branch e só então libera ./dp act2
```

Escrever a justificativa **antes** do discriminador é a habilidade que está sendo treinada —
no trabalho real a segunda mudança também chega depois da decisão. O `./dp review` compara o
que você escreveu no `CHOICE.md` com o que o ato 2 efetivamente cobrou. Essa comparação é o
melhor feedback que o repositório sabe dar.

A base das vizinhanças é a seção *Relations with Other Patterns* do refactoring.guru, que é
onde o site é melhor que o livro: ela é usada como **mapa** de quais patterns confundem-se
com quais — não como texto (§16).

Regras do validador para um `choice`:

- ≥ 2 pastas em `solutions/`, uma por candidato (incluindo `no-pattern/` quando for o caso);
- **exatamente uma** marcada `"absorbsAct2": true`;
- toda solução que **não** absorve precisa dizer, no seu `WALKTHROUGH.md`, o que o ato 2 lhe
  custou — em arquivos e linhas, medidos, não estimados;
- as soluções se cruzam explicitamente, como no §4.3 do repo anterior.

### 5.3 `katas/` — nada nomeado

Código maior (250–500 linhas), realista, múltiplas pressões sobrepostas, nenhum candidato
listado. Dois atos, 2+ rotas publicadas. **Pelo menos um kata tem como melhor rota publicada
"nenhum pattern"** — e ele não se anuncia.

Três katas chegam **sem testes**: o primeiro passo é escrever a rede (capítulo 4 do Fowler).
Mesmo mecanismo e mesmo gate de leitor do §18 do `refactoring-practice`.

**Regra de proporção**, herdada: um kata só entra quando os drills dos patterns que ele
exige já existirem.

---

## 6. Estrutura de diretórios

```
design-patterns-practice/
├── dp                          # o dispatcher (§8)
├── README.md / .en.md / .pt.md # gerados (§3.1 do repo anterior)
├── docs/
│   ├── DESIGN.md               # este documento
│   ├── HOW-TO-PRACTICE.md      # o loop, os dois atos, o que a trava não faz
│   ├── PATH.md                 # a ordem recomendada de estudo ≠ a ordem das pastas (§18)
│   ├── CATALOG.md              # os 23 patterns → exercício, com veredito (gerado)
│   ├── CHOICES.md              # pattern → em quais choices ele é candidato (gerado)
│   ├── TYPESCRIPT.md           # o que muda de forma em TS, e por quê (§10)
│   ├── NAMING.md               # herdado, com a seção de nomes de papéis (§10)
│   ├── REVIEW.md               # a rubrica, sem gabarito (§15)
│   └── pattern-names.json      # os 23 nomes canônicos — fonte da verdade do validador
└── exercises/
    ├── drills/
    │   ├── 01-creational/
    │   │   ├── factory-method/
    │   │   ├── abstract-factory/
    │   │   └── ...
    │   ├── 02-structural/
    │   └── 03-behavioral/
    ├── choices/
    │   ├── picking-policy/
    │   └── ...
    └── katas/
```

Duas escolhas de nomenclatura:

**As pastas são os três grupos do GoF**, numeradas para o `ls` sair na ordem do livro. É a
taxonomia que todo mundo conhece e por onde as pessoas chegam.

**Os ids são os slugs dos patterns**, não números. `./dp start strategy` funciona; `drill-03-08`
não agrega nada e o §16.5 do repo anterior já aprendeu que ids devem ser difusos. `strategy`,
`Strategy`, `drill-strategy` e `state-vs-strategy` resolvem sem ambiguidade.

**E a ordem das pastas não é a ordem de estudo.** A taxonomia do GoF é um índice, não um
currículo: começar por Creational é começar pelos patterns mais abstratos e menos motivados
— Abstract Factory não faz sentido antes de você ter sentido a dor que ele resolve.
`docs/PATH.md` dá a ordem recomendada (§18), e a ordem de **escrita** do repo segue o
currículo, não a taxonomia (§17).

---

## 7. Anatomia de um exercício

```
exercises/drills/03-behavioral/state/
├── meta.json
├── README.en.md              # ato 1 — sem diagrama, sem nome de papel (§4)
├── README.pt.md              # opcional
├── src/
│   ├── index.ts              # fronteira pública congelada
│   └── telescope.ts          # você edita aqui
├── tests/
│   └── telescope.spec.ts     # verde desde o commit inicial, imutável
├── act2/
│   ├── README.en.md          # o requisito novo — revelado por ./dp act2
│   └── tests/
│       └── fault-state.spec.ts
└── solutions/
    └── state/
        ├── index.ts · telescope.ts · states/
        ├── STEPS.md           # a rota do ato 1, terso
        ├── WALKTHROUGH.md     # o comentário + o UML + os papéis (§11)
        └── ACT2.md            # como a solução absorve o ato 2, com os números medidos
```

### 7.1 Contrato do enunciado (ato 1)

1. **Context** — 2 a 4 frases de domínio.
2. **The pressure** — o que já dói hoje, e **qual mudança é esperada** (sem dizer quando nem
   qual). Nos drills, nomeada com o vocabulário de smells do Fowler quando cabe.
3. **The target** — nos drills, o nome do pattern. Nos choices, a lista de candidatos. Nos
   katas, nada.
4. **Done when (act 1)** — objetivo: suíte verde, o construto proibido ausente
   (`./dp shape`), lint estrito limpo.
5. **Then run `./dp act2`** — a frase que diz que o exercício não terminou.
6. **Hints** — 2 ou 3, escalonadas, em `<details>`.
7. **Reading** — GoF por nome de pattern e seção; refactoring.guru por link. Nunca o texto.

### 7.2 `ACT2.md` — o arquivo que fecha o argumento

Novo em relação ao repo anterior, e o mais curto dos três markdowns (~40 linhas). Por
solução:

```markdown
## O que o ato 2 pediu
Um quarto estado (`fault`), e a recusa de transitar de `fault` direto para `tracking`.

## O que custou nesta rota
+1 arquivo (`states/fault.ts`), 1 linha no registry, 0 edições nos estados existentes.
Medido: `./dp trade state` → dentro do orçamento.

## O que teria custado sem o pattern
4 métodos com um `if` novo cada, e a transição ilegal passa a ser um caso que nenhum
lugar centraliza. Medido na branch `baseline/no-pattern`: 4 arquivos, 19 linhas.

## O que esta rota piorou
Ler o fluxo completo agora exige abrir 5 arquivos. O `switch` era pior para mudar e
melhor para *ler de uma vez* — e isso não é uma troca neutra.
```

A terceira seção é a que dá trabalho e é a que convence: o contrafactual **medido**, numa
branch que existe no repo. Sem ela, "o pattern vale a pena" continua sendo fé.

---

## 8. O que se reaproveita e o que é novo

Herdado do `refactoring-practice` sem mudança de forma:

- um **projeto do Vitest por exercício** com alias `@exercise` próprio, gerado dos
  `meta.json` (§15 do repo anterior) — e agora também por ato;
- um **`tsconfig.json` por exercício**, gerado;
- **dois perfis de oxlint** independentes, nunca com `extends` (a pegadinha do §16 anterior);
- oxfmt com versão pinada e `ignorePatterns: ["**/*.md"]`;
- `meta.json` como fonte única, índices **gerados**, `--check` na CI;
- o dispatcher (`./dp`), os ids difusos, `./dp check` como único comando de CI;
- `docs/REVIEW.md` como prompt, **sem as soluções no pacote** (§16.4 anterior);
- `docs/NAMING.md`, as quatro perguntas.

Novo, e cada item existe por causa do §2:

| Novo | O que faz | Por que não existia antes |
| --- | --- | --- |
| `act2/` + `ACT=2` | O segundo ato | Refatoração não tem segundo ato: a prova é a suíte verde |
| `./dp trade` | Mede pagou × comprou | O valor de um pattern não é observável no comportamento |
| `./dp choose` | Registra a decisão antes do discriminador | Não há decisão a registrar num drill de refactoring |
| `./dp shape` | Checagem advisory de construto proibido | O "done when" aqui é estrutural, não de tamanho (§12) |
| `branch baseline/no-pattern` | O contrafactual medido | — |
| `verdict` no `meta.json` | A camada de honestidade (§9) | O catálogo do Fowler não tem patterns obsoletos |

O que **não** se reaproveita é o perfil estrito como critério principal: ver §12.

---

## 9. A camada de honestidade: o veredito por pattern

O catálogo do Fowler não tem movimentos ruins. O do GoF tem — alguns envelheceram, um foi
amplamente reconhecido como um erro, e dois quase nunca aparecem. Um repositório que
apresenta os 23 como 23 boas ideias mente por omissão.

Cada drill declara um `verdict`, exibido no `CATALOG.md`:

| Veredito | Patterns | O que significa |
| --- | --- | --- |
| `essential` | Strategy, Observer, Command, State, Template Method, Iterator, Adapter, Decorator, Composite, Facade, Factory Method, Builder | Você vai usar, e reconhecer vale mais que decorar |
| `situational` | Abstract Factory, Prototype, Bridge, Proxy, Chain of Responsibility, Mediator, Memento, Visitor | Resolvem um problema real e estreito; o erro comum é aplicá-los fora dele |
| `niche` | Flyweight, Interpreter | Quase sempre a resposta é outra; o drill existe para você reconhecer o caso raro |
| `avoid` | Singleton | O drill ensina o que ele tentava proteger e por que o caminho é outro |

Três regras de disciplina, porque isso é **opinião** e precisa se comportar como tal:

1. O `CATALOG.md` diz, em voz alta, que o veredito é a opinião do autor do repositório, não
   do GoF.
2. Todo veredito que não seja `essential` tem, no `WALKTHROUGH.md`, **um parágrafo dizendo o
   que mudaria de ideia** — e o de `avoid` tem o caso em que o Singleton ainda seria a
   resposta menos pior.
3. Nenhum drill é cortado por causa do veredito. `niche` e `avoid` são exercícios bons
   justamente porque o ato 2 expõe o limite do pattern.

Flyweight merece uma nota de projeto própria: **o drill dele é o único que obriga uma
medição**. Um exercício de Flyweight sem número de alocação antes e depois é culto à carga —
o pattern existe para trocar memória por indireção, e sem a medida não há troca, só
indireção. O ato 2 dele é um orçamento de memória, não um requisito funcional.

---

## 10. A camada TypeScript — `docs/TYPESCRIPT.md`

É aqui que o repositório justifica existir ao lado do refactoring.guru, que já explica os
patterns muito bem. O que ele **não** faz é dizer quais deles a sua linguagem já resolveu.

O documento responde, por pattern: *o que em TypeScript muda a forma, e em que ponto a
versão clássica volta a ser necessária?*

| Pattern | Em TS | Quando a forma clássica volta a valer |
| --- | --- | --- |
| Strategy | Um tipo de função | Quando a estratégia tem estado, mais de um método, ou precisa ser descoberta por nome num registry |
| Command | Uma closure | Quando precisa de `undo`, serialização, nome, ou composição em macro |
| Template Method | Uma função de ordem superior com hooks | Quando os hooks são muitos e a família é estável — herança documenta melhor o contrato |
| Iterator | `Symbol.iterator` + generators | Nunca se escreve `hasNext()/next()`: o drill implementa **o protocolo da linguagem** |
| Singleton | Um módulo | Quando precisa de inicialização tardia com dependências — e aí o nome disso é injeção |
| Prototype | `structuredClone` | Quando a cópia é polimórfica ou o objeto tem identidade/recursos |
| Adapter | Tipagem estrutural: nada de `implements`, um objeto literal basta | Quando a adaptação tem estado ou precisa ser trocada em runtime |
| Bridge | Genéricos cobrem parte | Quando os dois eixos variam de verdade e ambos são abertos |
| Memento | `#private` + tipo brandado para o token opaco | A intenção ("o caretaker não pode ler") é a parte difícil em TS |
| Visitor | União discriminada + `switch` exaustivo, com o compilador como rede | Quando os nós vêm de fora ou o conjunto é aberto |
| Observer | `EventTarget`, emitters, signals | Quando a ordem, o descadastro e o isolamento de erro importam — e aí você está escrevendo o pattern |

Duas notas que vão em destaque porque geram confusão real:

- **Decorators do TypeScript (`@algo`) não são o Decorator pattern.** São metaprogramação em
  ponto de declaração; o pattern é composição em runtime. Nomes colididos, problemas
  diferentes.
- **União discriminada é uma alternativa de primeira classe a metade do livro**, e o
  compilador a torna mais segura que o polimorfismo em vários casos (exaustividade
  verificada). Vários `choices/` têm a união discriminada como candidato legítimo — e às
  vezes vencedor.

Esse documento é gerado à mão, não por script, e é o que eu publicaria como post antes de o
repo estar completo.

---

## 11. UML: Mermaid, e só no walkthrough

GoF ensina por diagrama, e um repositório de patterns sem diagrama nenhum perde a ponte com
o livro. Mas o diagrama **é** a resposta (§4), então ele mora no `WALKTHROUGH.md`.

Formato: `mermaid classDiagram` — renderiza nativamente no GitHub, é texto versionável e não
adiciona dependência nenhuma (o critério do §6 do repo anterior: cada dependência é uma
chance a mais do `npm install` falhar às 23h).

Cada diagrama aparece **duas vezes**: a estrutura do GoF com os nomes dos papéis, e a mesma
estrutura com os nomes reais do exercício. O mapeamento entre as duas é a tradução que
ninguém faz explicitamente e que é a real dificuldade de ler o livro.

---

## 12. Critério de pronto: por que o perfil estrito não basta aqui

No `refactoring-practice`, `lint:strict` (função ≤ 12 linhas, complexidade ≤ 5, aninhamento
≤ 2) *é* o critério de pronto, e funciona: refatorar encurta e desaninha.

Aqui ele é quase inútil como alvo — **um pattern passa nesses limites por construção**. Ele
não encurta funções: ele espalha responsabilidade por arquivos. Um Abstract Factory
desnecessário passa folgado no perfil estrito.

Então o critério de pronto tem três partes, em ordem de força:

1. **`./dp trade` dentro do orçamento** — o critério de verdade (§3). Objetivo, medido,
   específico do exercício.
2. **`./dp shape <id>` — advisory, sempre sai 0.** Procura o construto que o exercício
   declara como proibido: `"forbidden": ["switch\\s*\\(\\s*\\w+\\.kind", "instanceof"]`. É
   regex, é frágil, e a saída do comando diz isso. Ele pega o caso óbvio ("o `switch` sobre
   `kind` ainda está lá") e não pretende mais. Mesma postura do `./dp names` (§16.3 anterior):
   verde aqui não é o mesmo que certo.
3. **`lint:strict` e `tsc --noEmit`** — continuam rodando. Pegam função longa e `any`; não
   medem desenho.

E o que nenhum dos três pega — os papéis bem nomeados, a abstração que vazou, a indireção
que não paga — é o que o `./dp review` existe para discutir (§15).

---

## 13. `meta.json`

```json
{
  "id": "drill-state",
  "title": "State",
  "type": "drill",
  "category": "behavioral",
  "patterns": ["State"],
  "verdict": "essential",
  "difficulty": 3,
  "estimatedMinutes": 45,
  "prerequisites": ["drill-strategy"],
  "apiFrozen": true,
  "providesTests": true,
  "translations": ["en"],
  "act2": {
    "axis": "aligned",
    "summary": "a fourth state, and one transition that must be refused",
    "extensionBudget": { "maxFilesModified": 1, "maxLinesModified": 3 }
  },
  "forbidden": ["switch\\s*\\(\\s*this\\.status", "status\\s*===\\s*\""],
  "solutions": [
    { "slug": "state", "title": "State objects", "absorbsAct2": true,
      "tradeoff": "Transição ilegal fica impossível de expressar; ler o fluxo inteiro exige abrir 5 arquivos." }
  ],
  "reviewFocus": ["..."]
}
```

Campos novos em relação ao repo anterior: `category`, `patterns`, `verdict`, `act2`,
`forbidden`, e `absorbsAct2` por solução.

O validador checa, além das regras herdadas:

- todo nome em `patterns` está em `docs/pattern-names.json` (os 23 literais do GoF);
- `type: "choice"` → ≥ 2 soluções e **exatamente uma** com `absorbsAct2: true`;
- `type: "drill"` → 1 solução, ou 2 com `"variants": "language"` justificado;
- todo exercício tem `act2/README.en.md` e `act2/tests/` não vazios;
- toda solução que não absorve o ato 2 tem a seção de custo medido no `ACT2.md`;
- `act2.axis: "orthogonal"` exige, no `WALKTHROUGH.md`, qual pattern *teria* absorvido;
- o `src/` não é byte-idêntico a nenhuma solução (a regra paga com bug do repo anterior).

`CHOICES.md` é gerado invertendo os candidatos declarados: para cada pattern, em quais
exercícios de escolha ele aparece como opção. É o índice que ajuda sem dar a resposta.

---

## 14. CI

`./dp check`, um comando, na ordem que falha mais rápido:

| Passo | Garante |
| --- | --- |
| Baseline ato 1 | Toda suíte de ato 1 verde contra `src/` |
| Soluções, ato 1 | Toda solução passa na mesma suíte |
| Soluções, ato 2 | `ACT=2` verde em toda solução marcada `absorbsAct2` |
| Orçamento | Para cada solução, o `trade` medido está dentro do `extensionBudget` declarado |
| Contrafactual | A branch `baseline/no-pattern` dos exercícios que a declaram ainda compila e ainda estoura o orçamento |
| Lint, formato, tipos | Herdados |
| Metadados e índices | `validate` + `index --check` |

O quarto passo é o que tem valor novo: **a CI prova que os números publicados no `ACT2.md`
são verdade.** Sem isso, o argumento central do repositório é uma afirmação num markdown.

O quinto é o mais fácil de apodrecer e o mais honesto: uma branch de contrafactual que
ninguém roda vira ficção em dois meses.

---

## 15. O loop de quem usa

```bash
gh repo fork giovaniferro/design-patterns-practice --clone
cd design-patterns-practice && npm install
git switch -c pratica

./dp start state                 # imprime o enunciado do ato 1 e roda a suíte em watch
# ... você reestrutura, suíte verde o tempo todo, um commit por passo ...
./dp shape state                 # o construto proibido ainda está aí?
git commit -am "act 1 done"

./dp act2 state                  # revela o requisito novo e grava a base do trade
# ... você implementa ...
ACT=2 npm test
./dp trade state                 # pagou × comprou, contra o orçamento
./dp diff state --act2           # compara com a solução publicada
./dp review state                # a rubrica, sem gabarito
```

Num `choice`, um passo a mais e ele é obrigatório:

```bash
./dp choose picking-policy --pattern state --because "..."   # antes do ./dp act2
```

Quatro regras no topo do `HOW-TO-PRACTICE.md`:

1. **Testes verdes o tempo todo no ato 1.** Se ficarem vermelhos por mais de dois minutos,
   `git restore` e recomece menor. (Herdado, e continua sendo a regra mais útil.)
2. **Não leia o `act2/` antes de terminar o ato 1.** Está commitado; você consegue. Ler é
   trocar o único exercício de julgamento do repositório por um exercício de transcrição.
3. **Um commit por passo, e um commit que fecha o ato 1.** O `trade` precisa dessa fronteira,
   e o `git log` contra o `STEPS.md` continua sendo a melhor autoavaliação.
4. **Quando o `trade` estourar o orçamento, não ajuste o orçamento.** Estourar é o achado:
   ou o pattern está incompleto, ou é o pattern errado para aquele eixo. Os dois casos valem
   mais que um número verde.

---

## 16. Direito autoral — mais apertado que no repo anterior

Duas fontes, e a segunda exige cuidado que o `refactoring-practice` não precisava ter: o
catálogo do Fowler é publicado aberto em refactoring.com; **o refactoring.guru não é**. É
produto pago, com texto, analogias e ilustrações autorais.

O que é vocabulário compartilhado e pode: os **23 nomes** dos patterns, os **nomes dos
papéis** (`Context`, `ConcreteStrategy`, `Originator`, `Caretaker`), a classificação em três
grupos, a ideia de que existem vizinhanças entre patterns.

O que não pode, e entra como critério de aceitação de PR:

- **Nenhum domínio de exemplo das fontes.** Essa é a regra que vai ser violada sem má
  intenção, porque as analogias do refactoring.guru são boas e grudam. Blacklist explícita no
  `CONTRIBUTING.md`: o app de navegação (Strategy), a rede social com posting
  (Bridge/Abstract Factory), o editor de texto com undo (Command/Memento), a loja de móveis
  (Abstract Factory), o sistema de notificação (Decorator), o labirinto e o editor Lexi (GoF),
  o exemplo de café/bebidas (que não é das fontes mas é o clichê universal de Decorator).
- **Nenhuma transcrição de prosa.** No máximo uma frase curta, com atribuição.
- **Nenhum pseudocódigo das fontes**, nem traduzido para TS. Os exemplos de TypeScript
  publicados no refactoring.guru também são autorais.
- **Nenhuma ilustração.** Os diagramas do repo são Mermaid escritos aqui (§11).
- Referências de leitura são ponteiros: "GoF, *State*, seção *Consequences*" e um link para a
  página do refactoring.guru. Link é cortesia e é tudo.
- O README raiz diz que o material é **não oficial**, sem vínculo com os autores do GoF nem
  com o refactoring.guru, e que as duas fontes são pré-requisito, não substituídas por aqui.

Licença MIT no código.

---

## 17. Roadmap

A implementação está **adiada**: o `refactoring-practice` está no meio da Fase 3 e dois
repositórios meio-prontos valem menos que um pronto. O gate para começar é o `CATALOG.md`
do repo anterior em 100%.

| Fase | Entrega | Critério de pronto |
| --- | --- | --- |
| **0 — agora** | Este documento, o roadmap e o brief de agente | Feito |
| **1 — Esqueleto** | Tooling forkado, `./dp`, o harness de dois atos, `trade`, `shape`, `choose`, CI, e **o drill de referência: Strategy** | `./dp check` verde; o `trade` do drill de referência imprime os dois números e a CI os confere |
| **2 — Módulo piloto: comportamentais** | Os 11 drills behavioral (sem Interpreter) + 3 `choices` + 1 kata | Você resolve os 11 sem ler nenhum `act2/` antes da hora |
| **3 — Estruturais e criacionais** | 12 drills + `docs/TYPESCRIPT.md` | `CATALOG.md` em 100%, veredito declarado em todos |
| **4 — Escolhas e katas** | `choices/` completo (8) + 5 katas + Interpreter | `CHOICES.md` cobre os 23 |
| **5 — Template** | O que foi aprendido aqui volta para o `book-practice-template` | Um terceiro repo de livro nasce em < 1 hora |

**A Fase 2 é o gate real, e a escolha do módulo piloto é deliberada.** Behavioral primeiro
contraria a ordem das pastas (§6) por três razões: é onde estão os patterns que você usa de
verdade; é onde o teste da segunda mudança é mais fácil de desenhar bem; e é onde TypeScript
mais muda a forma (§10) — se o formato não sobrevive a Strategy-como-função e
Iterator-como-generator, é melhor descobrir no primeiro módulo.

Ordem de escrita dentro de um exercício — e ela é diferente da do repo anterior, porque aqui
existe um ato 2:

**domínio → solução limpa do ato 1 → testes do ato 1 verdes → lint estrito limpo → *absorver
o ato 2 na solução e medir* → des-estruturar para criar o `src/` → markdowns.**

O passo novo é o quinto, e ele é o único que descobre o defeito fatal: se o ato 2 não couber
no orçamento nem na **sua** solução, o exercício está errado — ou o orçamento é fantasia, ou
o pattern não protege o eixo que você achou. Descobrir isso antes de escrever 260 linhas de
walkthrough é a diferença entre uma tarde e uma semana.

---

## 18. Mapa dos módulos e a ordem de estudo

Pastas em ordem GoF; `docs/PATH.md` em ordem de currículo. As duas listas, lado a lado, para
deixar claro que são diferentes de propósito.

### Ordem das pastas (taxonomia GoF)

**01-creational (5):** Factory Method · Abstract Factory · Builder · Prototype · Singleton
**02-structural (7):** Adapter · Bridge · Composite · Decorator · Facade · Flyweight · Proxy
**03-behavioral (11):** Chain of Responsibility · Command · Interpreter · Iterator ·
Mediator · Memento · Observer · State · Strategy · Template Method · Visitor

### Ordem recomendada (`docs/PATH.md`)

1. **Varia o comportamento** — Strategy, Template Method, State, Command
2. **Quem avisa quem** — Observer, Mediator, Chain of Responsibility
3. **Envolve e adapta** — Adapter, Decorator, Facade, Proxy
4. **Estruturas recursivas** — Composite, Iterator, Visitor
5. **Criação** — Factory Method, Builder, Abstract Factory, Prototype
6. **Casos estreitos** — Memento, Bridge, Flyweight, Singleton (`avoid`), Interpreter (*stretch*)

A criação vem em quinto de propósito. Factory Method é o primeiro pattern de todo tutorial e
é uma péssima porta de entrada: ele resolve um problema de acoplamento que você só sente
depois de ter composto objetos por um tempo. Ensinado cedo, vira cerimônia.

### Mundos

Um mundo por camada, para que 40+ exercícios não pareçam o mesmo programa quarenta vezes:

| Camada | Mundo |
| --- | --- |
| `01-creational` | **Thornbury Print Works** — gráfica: famílias de máquinas, orçamentos, templates de documento |
| `02-structural` | **Caldermoor Transit Authority** — transporte: rede, tarifas, leitores legados, posição de veículos |
| `03-behavioral` | **Hollowell Observatory** — observatório: agendamento, controle de instrumento, alertas, undo |
| `choices` | **Ravensgate Fulfilment** — logística: um domínio rico em eixos de mudança, que é o que a camada precisa |
| `katas` | Mistos, atravessando mundos |

O detalhe de cada exercício — subdomínio, a pressão do ato 1, o eixo do ato 2 — está em
`design-patterns-practice-roadmap.md`.

---

## 19. Em observação

As apostas deste design, para conferir contra a realidade na Fase 2:

- **O orçamento de churn é a aposta principal.** `maxFilesModified` e `maxLinesModified`
  podem ser frágeis demais: um nome diferente do seu, uma ordem de import, e o número muda
  sem que o desenho tenha mudado. Se virar briga com o medidor em vez de conversa sobre
  desenho, o ajuste é medir **arquivos existentes tocados** e abandonar a contagem de linhas
  — não afrouxar o número.
- **A trava do `./dp choose` pode ser atrito puro.** Ela treina a habilidade certa, e também
  é um passo a mais entre você e o código às 23h. Se depois de 3 `choices` ela estiver sendo
  pulada, a saída é ela virar parte do `./dp review` (comparar a decisão *depois*) em vez de
  um comando separado.
- **As duas variantes de linguagem (classe × função)** em Strategy e Command podem dobrar o
  custo sem dobrar a lição. Escrever a de classe primeiro e só voltar quando a de função
  tiver algo próprio a dizer — a mesma regra do §4.3 do repo anterior.
- **A branch `baseline/no-pattern`** é a peça mais provável de apodrecer. Se a CI dela virar
  manutenção, a alternativa é guardar o contrafactual como um patch em `act2/baseline.diff`
  em vez de uma branch viva.
- **`./dp shape` pode ser pior que nada.** Uma regex advisory que erra muito gera desconfiança
  em todo o resto. Se na Fase 2 ela estiver dando mais falso-positivo que achado, remover —
  o `trade` já é o critério de verdade e o `shape` é conveniência.
- **O veredito `avoid` do Singleton vai gerar issue.** Isso é bom. A regra do §9.2 (o
  parágrafo do "o que mudaria de ideia") existe para essa discussão acontecer com conteúdo.

---

## 20. Publicação no GitHub

- Repo público `design-patterns-practice`, MIT, descrição do §1.
- Topics: `design-patterns`, `typescript`, `gof`, `kata`, `practice`, `software-design`,
  `refactoring`, `vitest`, `oxlint`.
- Branch protection em `main` exigindo `./dp check`.
- Os três READMEs gerados (§3.1 do repo anterior), com o disclaimer de não-oficialidade e o
  `CATALOG.md` como primeiro link.
- Issue templates: *novo exercício*, *exercício confuso*, *escolha discutível*, **veredito
  discutível**. O terceiro e o quarto são onde a discussão de desenho mora, e são o motivo de
  o repo ser público.
- O `README.md` abre explicando os dois atos em cinco linhas. Se um visitante não entender o
  mecanismo do §3 no primeiro parágrafo, o repo parece um dos quarenta repos de
  "design patterns in TypeScript" que só têm a estrutura implementada.

---

## Fontes

- [Design Patterns catalog — refactoring.guru](https://refactoring.guru/design-patterns/catalog)
  (22 patterns; Interpreter não tem página — confirmado 404)
- [Strategy — refactoring.guru](https://refactoring.guru/design-patterns/strategy)
  (estrutura da página e a seção *Relations with Other Patterns*, base do §5.2)
- [Design Patterns in TypeScript — refactoring.guru](https://refactoring.guru/design-patterns/typescript)
- GoF, *Design Patterns: Elements of Reusable Object-Oriented Software*, 1994 — os 23 nomes,
  os papéis e as seções *Applicability* e *Consequences* como referência de leitura
- `claude/refactoring-practice-design.md` — o tooling, o harness e as lições de §15 a §18

---

## 21. Notas de implementação (Fase 1)

O que a Fase 1 descobriu ao sair do papel. Seis pontos em que o design mudou de forma no
contato com a realidade — todos registrados aqui porque a Fase 2 vai depender deles.

### 21.1 O harness não tem dependência nenhuma

O plano previa Vitest. O ambiente onde a Fase 1 foi construída tem o registro do npm
bloqueado por política de egresso, e a escolha era entregar um repositório escrito contra um
runner que nunca rodou, ou medir o que o Node já faz. A segunda resposta acabou melhor que o
plano:

- `node --experimental-transform-types --test` roda testes em TypeScript direto, incluindo
  parameter properties e o resto da sintaxe não-apagável;
- `--watch` e `--experimental-test-coverage` são nativos;
- portanto **praticar não exige `npm install`**, que é a conclusão lógica do princípio do §6
  do `refactoring-practice` ("cada dependência a menos é uma chance a menos de o
  `npm install` falhar às 23h"), levado até o fim.

`typescript`, `oxlint` e `oxfmt` continuam declarados — como **opcionais**. O `./dp check`
pula o passo quando a ferramenta não está instalada, diz que pulou, e a CI do GitHub instala
os três e roda tudo.

**O buraco, e o que sobrou dele.** O stripping do Node apaga os tipos sem conferir nada, então
`strict` e `noUncheckedIndexedAccess` só valem onde o `tsc` roda. Mas o buraco é menor do que
parecia: **o código dos exercícios não importa nada do Node** — só os testes importam
`node:test` e `node:assert`. Daí o `tsconfig.exercises.json`, que checa `src/` e `solutions/`
com `types: []`, sem precisar de `@types/node`:

```bash
npm run typecheck:exercises     # precisa só do tsc
npm run typecheck               # o completo: tsc + @types/node, roda na CI
```

O drill de referência foi verificado assim, com `strict`, `noUncheckedIndexedAccess` e
`exactOptionalPropertyTypes` ligados, antes e depois do patch do ato 2: limpo nos dois. O que
continua sem cobertura local são os **testes** e os **scripts** — e é a CI que fecha isso.

Um detalhe de semântica que vale registrar: o `./dp check` considera presente **apenas** a
ferramenta instalada no `node_modules` do próprio repo. Um `tsc` global de outra major versão
(foi o caso no ambiente da Fase 1: `tsc 6` com um `@types/node` incompatível) produz um mar de
erros que não são do repositório. Pular com aviso é mais honesto que falhar por acidente de
ambiente.

### 21.2 `#exercise` substitui duas engrenagens do §8

O §8 herdava do repo irmão "um projeto do Vitest por exercício" e "um `tsconfig.json` por
exercício, gerado". As duas deixaram de ser necessárias:

```json
{
  "imports": {
    "#exercise": {
      "solution-strategy": "./solutions/strategy/index.ts",
      "default": "./src/index.ts"
    }
  }
}
```

Um `package.json` por exercício, escrito à mão em cinco linhas. O Node resolve `#exercise`
pelo `package.json` mais próximo do arquivo que importa, e `--conditions=solution-<slug>`
troca o alvo. É o alias por ambiente do §5 do repo irmão, **nativo**, declarativo e
per-exercício — sem gerador, sem config compartilhado, sem o ternário que não escala para 61
exercícios.

Como o `moduleResolution: "nodenext"` do TypeScript entende `imports`, **um `tsconfig.json`
na raiz basta**. Toda a máquina de geração de tsconfig sai do projeto.

### 21.3 Patches no lugar da branch de contrafactual

O §7.2 pedia o custo do ato 2 **medido**, e o §14 pedia uma branch `baseline/no-pattern` que
a CI mantivesse honesta. Branch viva é a peça que apodrece primeiro. A implementação usa dois
patches por exercício:

```
patches/solution-act2.patch    o ato 2 absorvido pela solução   (o pattern paga)
patches/baseline-act2.patch    o ato 2 no src/, sem o pattern   (o contrafactual)
```

`./dp trade` aplica cada um numa cópia isolada do exercício, **roda a suíte do ato 2 lá** e
conta o diff. Isso é melhor que a branch em três aspectos: a CI verifica os dois números a
cada execução (um patch que não aplica mais falha alto), não há história para manter, e a
pasta `solutions/` fica no estado do **ato 1** — então quem abre a solução durante o ato 1 vê
menos spoiler do que veria.

O `trade` também checa uma coisa que o plano não tinha previsto: **o contrafactual precisa
estourar o orçamento**. Se ele couber, o pattern não comprou nada naquele exercício e o
exercício não prova a sua própria tese. Isso virou passo de CI.

### 21.4 `maxFilesModified` não discrimina; linhas e hunks discriminam

Medido no drill de referência:

| | arquivos novos | arquivos editados | linhas tocadas | hunks |
| --- | --- | --- | --- | --- |
| com o pattern | +1 | 1 | 3 | 1 |
| sem o pattern | 0 | 1 | 23 | 3 |

**"Um arquivo editado" nos dois casos.** O critério de arquivos, que o §19 apontava como o
refúgio caso a contagem de linhas virasse briga, é justamente o que não separa as duas rotas
aqui. O que separa é linhas (8×) e, sobretudo, **hunks**.

A contagem de hunks entrou por isso e virou a melhor métrica do conjunto: três hunks num
arquivo são três lugares que tiveram de concordar entre si. É o medidor de Shotgun Surgery, e
é o número que conta a história no `ACT2.md` do drill de referência. `maxHunks` passa a ser
um campo opcional do orçamento.

### 21.5 O exercício de referência mudou de ato 2 antes de existir

O ato 2 original exigia que cada política ganhasse um segundo membro (uma descrição para o
log da noite). Ao escrever, ficou claro que adicionar um membro à interface **edita as três
políticas existentes** — três arquivos, o oposto do que o exercício promete. O requisito foi
trocado por uma quarta política mais a resolução por nome vindo de config.

Esse é exatamente o defeito que o passo 5 da ordem de escrita (§17) existe para pegar, e ele
apareceu na primeira vez que a ordem foi seguida. A conversa classe × closure, que era o
motivo do segundo membro, migrou para a prosa do `WALKTHROUGH.md` — que é onde o roadmap já
mandava deixá-la até a variante de função ter algo próprio a dizer.

### 21.6 O ato 2 não falha inteiro contra o `src/`, e isso é informação

O brief manda que a suíte do ato 2 **falhe** contra o desafio. No drill de referência ela
falha em 3 dos 4 testes: o quarto — "um nome errado é recusado com a lista completa do que
existe" — passa, porque a lista hardcoded do `src/` coincide com as três políticas que
existem no ato 1.

Não é um defeito do teste: é o teste fazendo o seu trabalho. Ele prende a deriva entre a
mensagem de erro e o que o código aceita, e é o primeiro a quebrar no contrafactual, onde a
quarta política entra e a mensagem fica desatualizada. A invariante da CI é portanto no nível
da **suíte** ("o ato 2 não passa contra `src/`"), não de cada teste.
