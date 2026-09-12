[🌐 English](./README.en.md)

# Act 2 — a fourth job kind

Thornbury now offers **foil stamping**: `FoilStampingJob`, with a
`foilColor` (`"gold" | "silver" | "copper"`, defaulting to `"gold"` when
not given). Its time estimate grows with quantity:
`20 + ceil(quantity / 50)` minutes.

It has to work from **all three call sites** - the counter, a reprint,
and a batch import - the same way every other job kind already does.
