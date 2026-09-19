# Steps — discount-rules

1. `discountedCents(carrierId, baseCents)`: one function, pulled out of both
   `pickCheapestCarrier` and `pickCheapestForBatch`, applying each carrier's negotiated discount
   to its quoted price.
2. `pickCheapestCarrier` and `pickCheapestForBatch` each call `discountedCents` once per
   eligible quote, then keep their own copies of the zone check, the weight cap and the
   speed-tier filter exactly as `src/` has them - untouched, on purpose.
