[🌐 English](./README.en.md)

# Act 2 — a new modifier, and an order that now matters

Caldermoor is adding a senior discount: a flat 50-cent reduction, not a
percentage. Policy is explicit about the order: **the senior discount
must be applied before the student discount** - a senior-and-student
rider gets the flat discount off the base fare first, and the student
percentage applies to what's left. Doing it the other way around is not
a rounding quirk; it produces a genuinely different, lower price, and
finance has said that's not acceptable.

`calculateFare` gains a fourth flag, `isSenior`, and for a rider who is
both a senior and a student, the fare must come out to what applying the
flat discount first, then the percentage, produces - not the reverse.
