# Steps — eligibility-rules

1. `isEligible(carrierId, zone, weightKg)`: one function, pulled out of both
   `pickCheapestCarrier` and `pickCheapestForBatch`, deciding whether a carrier is even in the
   running - zone check first, weight cap second.
2. `pickCheapestCarrier` and `pickCheapestForBatch` each call `isEligible` once per quote, then
   keep their own copies of the speed-tier filter and the discount arithmetic exactly as `src/`
   has them - untouched, on purpose.
