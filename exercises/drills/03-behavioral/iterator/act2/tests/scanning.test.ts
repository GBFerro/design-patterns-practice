import assert from "node:assert/strict";
import { test } from "node:test";

import { ObservationLog, firstMatches, mostRecentMatch, recentMessages } from "#exercise";

function fill(log: ObservationLog, messages: readonly string[]): void {
  messages.forEach((message, index) => {
    log.append({ sequence: index, timestampIso: `2026-01-01T00:00:00Z`, message });
  });
}

test("recentMessages returns the most recent entries, most recent first", () => {
  const log = new ObservationLog();
  fill(log, ["a", "b", "c", "d", "e"]);

  assert.deepEqual(recentMessages(log, 3).messages, ["e", "d", "c"]);
});

test("recentMessages does not scan the whole log to get a few recent entries", () => {
  const log = new ObservationLog();
  fill(
    log,
    Array.from({ length: 20 }, (_, i) => `e${i}`),
  );

  const result = recentMessages(log, 2);

  assert.deepEqual(result.messages, ["e19", "e18"]);
  assert.equal(result.scanned, 2);
});

test("recentMessages caps at the log's size when asked for more than it has", () => {
  const log = new ObservationLog();
  fill(log, ["only", "two"]);

  const result = recentMessages(log, 10);

  assert.deepEqual(result.messages, ["two", "only"]);
  assert.equal(result.scanned, 2);
});

test("recentMessages of an empty log scans nothing", () => {
  const log = new ObservationLog();

  const result = recentMessages(log, 3);

  assert.deepEqual(result.messages, []);
  assert.equal(result.scanned, 0);
});

test("firstMatches returns matches in the order they occurred, capped at limit", () => {
  const log = new ObservationLog();
  fill(log, ["clear skies", "flare A", "calm", "flare B", "flare C"]);

  const result = firstMatches(log, "flare", 2);

  assert.deepEqual(
    result.entries.map((entry) => entry.message),
    ["flare A", "flare B"],
  );
  assert.equal(result.scanned, 4);
});

test("firstMatches stops well short of a long log once it has enough matches", () => {
  const log = new ObservationLog();
  fill(log, ["flare A", "flare B", ...Array.from({ length: 18 }, (_, i) => `calm ${i}`)]);

  const result = firstMatches(log, "flare", 2);

  assert.equal(result.entries.length, 2);
  assert.equal(result.scanned, 2);
});

test("firstMatches scans the whole log when fewer matches exist than the limit", () => {
  const log = new ObservationLog();
  fill(log, ["flare A", "calm", "calm"]);

  const result = firstMatches(log, "flare", 5);

  assert.equal(result.entries.length, 1);
  assert.equal(result.scanned, 3);
});

test("firstMatches on an empty log returns nothing, having scanned nothing", () => {
  const log = new ObservationLog();

  const result = firstMatches(log, "flare", 5);

  assert.deepEqual(result.entries, []);
  assert.equal(result.scanned, 0);
});

test("mostRecentMatch returns the last entry containing the needle, not the first", () => {
  const log = new ObservationLog();
  fill(log, ["flare A", "calm", "flare B", "calm"]);

  assert.equal(mostRecentMatch(log, "flare")?.message, "flare B");
});

test("mostRecentMatch returns undefined when nothing matches", () => {
  const log = new ObservationLog();
  fill(log, ["clear skies", "target acquired"]);

  assert.equal(mostRecentMatch(log, "flare"), undefined);
});
