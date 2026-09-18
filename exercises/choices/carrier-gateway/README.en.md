[🌐 English](./README.en.md)

# Carrier gateway

`Choice` · `Adapter · Proxy · Facade` · `●●●` · ~40 min

## Context

Ravensgate Fulfilment quotes a shipping rate at checkout by calling
whichever carrier the customer picked. Three carriers, three unrelated
native clients, none of which Ravensgate controls: `northbridgeQuote`
returns an object with `totalCents`/`transitDays`, `aerolaneRate` takes a
request object and returns `priceCents`/`days`, and `coastalEstimate` -
the oldest integration - takes and returns a single pipe-delimited
string.

## The pressure

`checkoutRate` and `compareRates` each carry the same three-way if/else,
once per function, translating whichever carrier's native shape into the
one `CarrierRate` shape the rest of checkout actually wants
(`{ cents, etaDays }`). Both functions agree today, because both were
written from the same three branches at the same time - but nothing
enforces that, and a fourth carrier would mean finding and editing both.

## The target

**One of three candidates**, and this repository isn't telling you which:

- **Adapter** - one small class per carrier, each implementing a common
  `CarrierGateway` interface, so `checkoutRate` and `compareRates` stop
  knowing any carrier's native shape at all.
- **Proxy** - one class, instantiated once per carrier, standing in for
  whichever native client is behind it.
- **Facade** - one entry point over the whole carrier subsystem, taking
  the carrier as an argument rather than being built around one.

Read the domain above, and this: all three candidates can make
`checkoutRate` and `compareRates` stop repeating themselves in act 1 -
that part won't tell them apart. What's worth sitting with is **where the
translation logic ends up living, and what that shape assumes about how
this subsystem will be asked to change next**. Write your answer down -
`./dp choose carrier-gateway --pattern <name> --because "..."` - before
you see act 2. That's the exercise.

## Done when (act 1)

- `./dp test carrier-gateway` is green throughout, against your `src/`.
- `checkoutRate` and `compareRates` behave exactly as they do today - this
  is a restructuring, not a rewrite. `./dp diff carrier-gateway --steps`
  (once you've chosen) shows one published route; yours doesn't have to
  match it, only the tests.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp choose carrier-gateway --pattern <name> --because "..."`, then `./dp act2 carrier-gateway`

## Hints

<details>
<summary>Does every candidate end up with the same number of carrier-shaped
branches somewhere in the code?</summary>

Yes - the three native shapes are real, and something has to translate
each one, no matter which candidate you pick. The question the exercise
is really asking is *how many places* know a given carrier's shape, and
whether that number can grow past one.

</details>

<details>
<summary>What does `CarrierGateway` actually promise?</summary>

One method, `rate(originZip, destZip, weightKg): CarrierRate` - built to
be implemented once per carrier *or* satisfied by one class that switches
internally *or* not implemented at all by whatever ends up as the
subsystem's single entry point. All three candidates are compatible with
the interface already in `src/types.ts`; none of them requires changing
it.

</details>

<details>
<summary>Is "one class per carrier" always cheaper to extend than "one
class, configured per carrier"?</summary>

Not obviously - it depends on what kind of change is coming. A change
that's the same shape in every carrier (a rule that applies regardless of
which one you're talking to) lands very differently depending on whether
there are three classes to touch or one.

</details>

## Reading

- GoF, *Adapter*, *Proxy* and *Facade* - the *Intent* sections. Facade's
  *Applicability* discusses what a facade does and doesn't hide, which is
  worth reading before you commit to an answer here.
- [Adapter](https://refactoring.guru/design-patterns/adapter),
  [Proxy](https://refactoring.guru/design-patterns/proxy) and
  [Facade](https://refactoring.guru/design-patterns/facade) on
  refactoring.guru.
