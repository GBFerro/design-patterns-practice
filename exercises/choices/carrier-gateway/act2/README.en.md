[🌐 English](./README.en.md)

# Act 2 — one rate request, one carrier call

`compareRates` and `checkoutRate` both get called for the same shipment more
than once in a normal session - a shopper refreshes the checkout page, or a
warehouse tool calls `compareRates` right after `checkoutRate` already asked
one of the same carriers. Every one of those repeats is a full call to a
carrier's native client for an answer that hasn't changed.

## The requirement

- An identical rate request - same `carrierId`, `originZip`, `destZip` and
  `weightKg` - must reach the carrier's native client **at most once**.
  A second identical request returns the same `CarrierRate` without calling
  it again.
- A request that differs in **any** of the four fields is a cache miss, not
  a hit - including two different carriers asked for the same route and
  weight.
- Every existing act 1 behaviour keeps working: `checkoutRate` and
  `compareRates` still return correct, carrier-specific rates.

## Done when (act 2)

- `./dp test carrier-gateway --act2 --solution <your-candidate>` is green.
- `carrierCallCount(carrierId)` - now exported - reports the real number of
  native-client calls for that carrier, and it's exactly 1 after two
  identical requests, not 2.

## Then run `./dp trade carrier-gateway`
