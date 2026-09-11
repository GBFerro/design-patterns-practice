# How to practise

Five lines of model, then the rules.

```bash
git clone <your fork> && cd design-patterns-practice
git switch -c pratica

./dp start strategy        # act 1: the brief, and the suite in watch mode
# ... you restructure src/, the suite stays green, one commit per step ...
./dp shape strategy        # is the construct the pattern removes actually gone?
git commit -am "act 1 done"

./dp act2 strategy         # the change nobody told you about
# ... you implement it ...
./dp test strategy --act2
./dp trade strategy        # paid × bought, against the declared budget
./dp diff strategy --steps # then the published route
./dp review strategy       # the rubric, with no answer key in it
```

`main` is always pristine. You work on a branch. Starting over is
`git restore --source=main exercises/…` — no magic script, no duplicated baseline folder.
There is nothing to install.

## The four rules

### 1. Green the whole way through act 1

Act 1 preserves behaviour. If the suite is red for more than two minutes, `git restore` and
take a smaller step. This is the rule that pays for itself fastest, and it is the one people
abandon first.

### 2. Do not read `act2/` before you finish act 1

It is committed. You can read it. `cat exercises/drills/03-behavioral/strategy/act2/README.en.md`
works and always will — **the lock is a nudge, not a chain**, and pretending otherwise in a
public repository would be a lie.

But reading it trades the only exercise in judgement this repository offers for an exercise
in transcription. The whole point is that you restructure *without knowing which change is
coming*, because that is the situation you are actually in at work.

The same goes for `solutions/`. It is the answer; it is not hidden from you either.

### 3. One commit per step, and one commit that closes act 1

`./dp trade` measures the act-2 diff from somewhere, and that somewhere is the commit where
act 1 ended. Without it there is nothing to measure.

The smaller habit is worth as much: at the end, `git log --oneline` for your exercise should
look like the published `STEPS.md`. Comparing those two logs is the best self-assessment this
repo offers, and `./dp diff <id> --steps` is the recommended first look for that reason.

### 4. When `trade` blows the budget, do not adjust the budget

Blowing it is the finding. Either the structure is incomplete, or it is the wrong structure
for the axis this change arrived on. Both are worth more than a green number.

There is a third possibility worth naming, because it is the most interesting one: the change
arrived along an axis the pattern does not protect. Some exercises are built that way on
purpose (`act2.axis: "orthogonal"` in their `meta.json`, marked ⚠ in the roadmap). In those,
a blown budget is the correct answer, and the question becomes *which* structure would have
absorbed it.

## What the two numbers mean

```
Ato 1 — o que a estrutura custou
  src/ → solutions/strategy/    +5 arquivos · +1 interface de extensão · 8 módulos no total

Ato 2 — a fourth policy, and the policy name now arrives from a config file
  ✓ com o pattern   +1 arquivo novo · 1 arquivo existente editado · 3 linhas tocadas · 1 hunk
  ✓ sem o pattern   +0 arquivos novos · 1 arquivo existente editado · 23 linhas tocadas · 3 hunks
```

Read them as a purchase. The first line is the price; the second pair is the goods, with the
counterfactual beside it. A pattern is never "good" — it is a trade, and this is the trade.

**Hunks are the number to watch.** Three hunks in one file means the change had to be made
consistently in three separate places. That is the shotgun surgery the structure exists to
remove, and it discriminates between the two routes far better than the file count does.

## A green suite is not proof that you chose well

It is proof that you did not break anything, which is necessary and nowhere near sufficient.
You can implement a pattern correctly and still have picked the wrong one; the suite passes
either way. That is the entire reason act 2 exists, and the reason `./dp review` asks about
things no check can see: whether the roles are named honestly, whether the abstraction leaked,
whether the indirection pays.

## On the advisory commands

`./dp shape` greps for the construct the exercise declares as forbidden. It is a regex, it
always exits 0, and it says so in its own output. It catches "the `switch` is still there".
It cannot catch "you built the wrong abstraction". Green there is not the same as right.

## Katas that ship without tests

Three katas arrive with no suite: writing the safety net is the first half of the exercise.
They are marked `providesTests: false`, and there the gate is coverage of the files the kata
declares as targets — `./dp test <id> --coverage`. That gate measures **your** net, not the
repository's health, which is why it is not part of `./dp check`.
