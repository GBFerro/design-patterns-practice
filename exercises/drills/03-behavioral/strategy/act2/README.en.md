[🌐 English](./README.en.md)

# Act 2 — next semester's queue

The time allocation committee approved a fourth way of ordering the queue, and
operations changed how the night is started.

**`darkest-first`.** Observe the highest targets first. Less atmosphere in the way
means better seeing, and on a night with thin cloud the operator wants the best
data in the bag early. Order the candidates by altitude, highest first.

**The policy name now comes from the night's config file.** Until now it was a
literal in the control script, checked at review time. An operator types it now, at
two in the morning, and they will get it wrong. When the name is not one we know,
the failure has to tell them what they *could* have written — all of it, not a
sample.

Everything else about a night is unchanged: the horizon is still the horizon, the
budget is still the budget, and a skipped request is still reported.
