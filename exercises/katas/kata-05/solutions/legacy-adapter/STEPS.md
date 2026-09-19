# Steps — legacy-adapter

1. `InventoryReader`: a one-method interface (`read(record): InventoryRecord`) that anything
   translating a legacy record could implement.
2. `LegacyWmsAdapter implements InventoryReader`: one class, holding the status/location/
   timestamp translation that used to be duplicated, plus a `supportedStatusCodes` getter
   (what this adapter knows how to translate) and a `recordsTranslated` counter (for the
   nightly job's completion log and the change-feed listener's health check).
3. `syncInventorySnapshot` and `applyChangeFeedEvent` each call `adapter.read(record)` against
   one shared `LegacyWmsAdapter` instance, instead of keeping their own copy of the translation
   rules.
