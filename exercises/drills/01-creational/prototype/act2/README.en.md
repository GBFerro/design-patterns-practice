[🌐 English](./README.en.md)

# Act 2 — a field the templates always had an opinion about, now on the type

Every template already implies a print process - a rush banner is printed
digitally, a letterhead is offset - but nothing records it. Add
`colorMode: "cmyk" | "spot"` to `JobTemplate`, and give each of the two
existing templates its actual value: `"rush-banner"` is `"cmyk"`,
`"letterhead-standard"` is `"spot"`.

A clone of either template must carry `colorMode` through, exactly like
every other field.
