[🌐 English](./README.en.md)

# Act 2 — a second press room, live at the same time as the first

Thornbury is opening a night shift with its own configuration - no rush
surcharge, but a higher daily cap (`rushSurchargePercent: 0,
maxDailyRushJobs: 12, maintenanceMode: false`) - running **at the same
time** as the existing main floor.

The suite needs both configurations live in the same test run: building
the night shift's press room must not affect the main floor's, and vice
versa - including calling `setMaintenanceMode` on one without it leaking
into the other.

Export `createPressRoom(settings): PressRoom` so a caller can build as
many independent press rooms as it needs.
