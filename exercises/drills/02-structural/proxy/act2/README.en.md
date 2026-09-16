[🌐 English](./README.en.md)

# Act 2 — access control, with zero edits to caller or subject

Caldermoor runs one vehicle the public dashboard should never show:
`svc-9`, a maintenance vehicle whose position dispatchers keep
restricted. Add that restriction - a lookup for `svc-9` must be
refused, with an error whose message names the vehicle, and it must
never reach the real lookup at all.

Every other vehicle keeps working exactly as before, from both callers.

Neither `currentPositions` nor `printFleetPositions` may change. Neither
may `RealVehiclePositionService`. Wherever this restriction lives, it
has to live somewhere both callers already pass through - without
either of them knowing it's there.
