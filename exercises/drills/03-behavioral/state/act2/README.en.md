[🌐 English](./README.en.md)

# Act 2 — a fault state

The mount's controller can now raise a hardware fault at any moment — a motor
stall, a lost encoder, a watchdog timeout. When it does, the telescope must
stop accepting every command except one.

**`raiseFault(reason)` must work from any state**, including mid-slew, and move
the telescope to a new `fault` status. From `fault`, **only `park()` is legal** —
it is the single recovery path, and it must work. `slewTo`, `arrive` and
`nudge` must all be refused from `fault`, the same way they are refused from
any other state they do not belong to.

Nothing about the three existing states' legal transitions changes.
