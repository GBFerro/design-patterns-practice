import assert from "node:assert/strict";
import { test } from "node:test";

import { createAlertCenter } from "#exercise";

test("a seeing alert reaches the log, the pager and the report, but not the dome", () => {
  const center = createAlertCenter();
  center.publish({ kind: "seeing", fwhmArcsec: 2.1 });

  assert.deepEqual(center.logEntries, ['seeing 2.1"']);
  assert.deepEqual(center.pagerEntries, ['seeing 2.1"']);
  assert.deepEqual(center.reportEntries, ['seeing 2.1"']);
  assert.deepEqual(center.domeEntries, []);
});

test("a weather alert reaches every consumer, including the dome", () => {
  const center = createAlertCenter();
  center.publish({ kind: "weather", condition: "high humidity" });

  assert.deepEqual(center.logEntries, ["weather: high humidity"]);
  assert.deepEqual(center.pagerEntries, ["weather: high humidity"]);
  assert.deepEqual(center.reportEntries, ["weather: high humidity"]);
  assert.deepEqual(center.domeEntries, ["closed: high humidity"]);
});

test("several alerts accumulate, in the order they were published", () => {
  const center = createAlertCenter();
  center.publish({ kind: "seeing", fwhmArcsec: 1.8 });
  center.publish({ kind: "weather", condition: "wind gust" });
  center.publish({ kind: "seeing", fwhmArcsec: 2.4 });

  assert.deepEqual(center.logEntries, [
    'seeing 1.8"',
    "weather: wind gust",
    'seeing 2.4"',
  ]);
  assert.deepEqual(center.domeEntries, ["closed: wind gust"]);
});

test("the dome stays empty across repeated seeing alerts", () => {
  const center = createAlertCenter();
  center.publish({ kind: "seeing", fwhmArcsec: 1.5 });
  center.publish({ kind: "seeing", fwhmArcsec: 1.9 });

  assert.deepEqual(center.domeEntries, []);
});

test("the pager records every alert, in the same order as the log", () => {
  const center = createAlertCenter();
  center.publish({ kind: "weather", condition: "dust" });
  center.publish({ kind: "seeing", fwhmArcsec: 3.0 });

  assert.deepEqual(center.pagerEntries, center.logEntries);
});

test("two alert centers do not share consumers", () => {
  const first = createAlertCenter();
  const second = createAlertCenter();

  first.publish({ kind: "seeing", fwhmArcsec: 1.2 });

  assert.deepEqual(first.logEntries, ['seeing 1.2"']);
  assert.deepEqual(second.logEntries, []);
});

test("the night report matches the log for a mixed sequence of alerts", () => {
  const center = createAlertCenter();
  center.publish({ kind: "seeing", fwhmArcsec: 2.0 });
  center.publish({ kind: "weather", condition: "lightning" });

  assert.deepEqual(center.reportEntries, center.logEntries);
});
