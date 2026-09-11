[🌐 English](./README.en.md)

# Act 2 — a new operator and a new term

Two additions to the constraint language, at once:

1. **A new operator, `>=`.** `"altitude >= 30"` must pass when the altitude
   is *exactly* 30, not just above it - `moon_phase >= 0.3` the same way.
   The existing `>` and `<` keep meaning what they meant.
2. **A new named term, `moon_below_horizon`.** `SkyContext` gains
   `moonBelowHorizon: boolean`; the clause `"moon_below_horizon"` reads it,
   the same way `"dome_open"` reads `domeOpen`.

Both can appear anywhere a clause already could, combined with `&&` exactly
like every existing clause: `"moon_below_horizon && altitude > 20"`,
`"seeing <= 2.0 && clear"` - wait, `<=` is not part of this act 2, only
`>=` - so a request for `"seeing <= 2.0"` should still fail to parse.

## Watch for

`>=` contains `>`. A clause like `"altitude >= 30"` must not be
mis-parsed as the field `"altitude "`, the operator `>`, and the raw
value `"= 30"` (which is not a number - `Number("= 30")` is `NaN`, and
every comparison against `NaN` is `false`, so a naive fix would make
`>=` clauses silently fail instead of throwing where you'd notice).
