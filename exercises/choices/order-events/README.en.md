[🌐 English](./README.en.md)

# Order events

`Choice` · `Observer · Mediator · Chain of Responsibility` · `●●●` · ~40 min

## Context

Ravensgate Fulfilment tells four different systems when an order ships: inventory gets its
count updated, analytics gets an event, the customer gets a confirmation email, and the
customer gets an SMS. `orderShipped` fires all four, in that order. So does
`resendOrderNotifications`, for a customer asking support to resend what they missed - the
exact same fan-out, triggered a second way.

## The pressure

`orderShipped` and `resendOrderNotifications` each call the same four consumers, in the same
order, once per function. They agree today because both were written from the same
requirements at the same time - but nothing enforces that, and a fifth consumer would mean
finding and editing both.

## The target

**One of three candidates**, and this repository isn't telling you which:

- **Observer** - four small classes, each wrapping one consumer, subscribed to a subject that
  notifies them all.
- **Mediator** - one class, one method, that already knows and sequences the full fan-out.
- **Chain of Responsibility** - the four consumers as links in a chain, each one free to stop
  the rest.

Read the domain above, and this: all three candidates can make `orderShipped` and
`resendOrderNotifications` share one definition of "what happens when an order ships" - that
part won't tell them apart. What's worth sitting with is **what happens when only some of the
four need to be told apart from the others** - who gets to know that a consumer is one kind
versus another, and how cheaply that distinction can be drawn without redesigning the whole
list. Write your answer down - `./dp choose order-events --pattern <name> --because "..."` -
before you see act 2. That's the exercise.

## Done when (act 1)

- `./dp test order-events` is green throughout, against your `src/`.
- `orderShipped` and `resendOrderNotifications` behave exactly as they do today - this is a
  restructuring, not a rewrite. `./dp diff order-events --steps` (once you've chosen) shows one
  published route; yours doesn't have to match it, only the tests.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp choose order-events --pattern <name> --because "..."`, then `./dp act2 order-events`

## Hints

<details>
<summary>Do all three candidates end up agreeing on which four consumers fire, and in what
order, for an ordinary order?</summary>

Yes - `inventory`, then `analytics`, then `email`, then `sms`, every time, in every candidate.
The question the exercise is really asking isn't "does it work today," it's what each
candidate assumes about whether that list of four will ever need to be treated as anything
other than one flat, equal group.

</details>

<details>
<summary>Does every consumer in act 1 know about the others?</summary>

No - not in any of the three candidates. Each consumer function does exactly one thing and has
no idea what runs before or after it; that's true whether it's wrapped in an Observer class, a
link in a chain, or just a call inside a Mediator's method.

</details>

<details>
<summary>Is "each consumer is independent" the same thing as "each consumer is cheap to treat
differently from the others"?</summary>

Not obviously - independence is about act 1: nothing has to change to add a fifth consumer that
behaves like the first four. Whether it's cheap to single two of them out for different
treatment is a different question, and the three candidates don't answer it the same way.

</details>

## Reading

- GoF, *Observer*, *Mediator* and *Chain of Responsibility* - the *Intent* sections.
- [Observer](https://refactoring.guru/design-patterns/observer),
  [Mediator](https://refactoring.guru/design-patterns/mediator) and
  [Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility)
  on refactoring.guru.
