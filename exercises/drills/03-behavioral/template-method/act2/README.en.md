[🌐 English](./README.en.md)

# Act 2 — a fourth instrument that skips a step

A guide camera is going on the mount: a cheap, uncooled finder camera used only to
keep the telescope locked on target between exposures. It needs no calibration —
there is no flat-field or arc-lamp reference for it, and operations does not want
one invented just to satisfy the pipeline.

**`guide-camera` must run connect → capture → download → disconnect.** Calibrate
does not run for it at all — not a no-op calibration, not an empty reference. The
step itself is absent from its log.

Every other instrument is unaffected: the three that exist keep calibrating
exactly as they do today.
