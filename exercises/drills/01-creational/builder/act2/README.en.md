[🌐 English](./README.en.md)

# Act 2 — a new stage, and a rule that spans it and an old one

A draft can now request **packaging**: `applyPackaging(packaging: "standard"
| "gift-wrap"): QuoteDraft`, defaulting to `"standard"`.

New rule, spanning this stage and one that already existed: **gift-wrap
packaging is not available for rush jobs.** The rule must hold no matter
which stage runs last:

- `startQuote(...).applyPackaging("gift-wrap").build()` must succeed (no
  rush requested).
- `startQuote(...).applyRush(15).applyPackaging("gift-wrap")` must throw -
  rush was requested first.
- `startQuote(...).applyPackaging("gift-wrap").applyRush(15)` must also
  throw - packaging was requested first, rush second.
