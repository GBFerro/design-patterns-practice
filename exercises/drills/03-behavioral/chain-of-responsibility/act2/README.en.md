[🌐 English](./README.en.md)

# Act 2 — a rule inserted in the middle, and one telescope's order changed

Instruments now need to report that they have finished warming up before a
request can run. **`request.instrumentWarmupComplete`** is a new, optional
field on `ObservationRequest` - `false` refuses the request with
*"instrument has not completed its warmup sequence"*; `true` or left unset
passes (every existing act-1 request, which never mentions warmup, keeps
behaving exactly as it did).

The warmup check does not go at the end. **It belongs between the moon
separation check and the instrument availability check** - after two checks
that only ever look at the target, before the first check that looks at the
instrument. Get the position right: a request that fails moon separation and
has not warmed up should still be refused for the moon, not the warmup; a
request that has not warmed up and also names an unavailable instrument
should be refused for the warmup, not the instrument.

**Ridgeline is a remote, robotic telescope, and checking the weather is the
cheapest of the six checks.** For Ridgeline specifically - no other telescope
- move the weather check to run *first*, before altitude. Every other
telescope keeps checking altitude first, same as act 1. Ridgeline keeps
skipping the dome clearance check, same as act 1 - only its position in the
order changes, not which checks apply to it.
