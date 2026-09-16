[🌐 English](./README.en.md)

# Act 2 — one new value on each axis

Caldermoor is adding a zone-based fare policy (a flat rate per zone
crossed, minimum two zones) **and** a transit pass payment medium (a
flat 10% discount off the base fare, rounded to the nearest cent) - at
the same time.

Every existing combination of policy and medium must keep working
exactly as it does today, and every new combination - zone paid in cash,
zone paid by card, flat paid by pass, distance paid by pass, and zone
paid by pass - must work through the same `calculateFare(policyKind,
mediumKind, measure)` entry point, unchanged in signature.
