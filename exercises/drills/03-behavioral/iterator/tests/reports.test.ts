import assert from "node:assert/strict";
import { test } from "node:test";

import { ObservationLog, allMessages, findFirst, lastEntries } from "#exercise";

function fill(log: ObservationLog, messages: readonly string[]): void {
  messages.forEach((message, index) => {
    log.append({ sequence: index, timestampIso: `2026-01-01T00:0${index}:00Z`, message });
  });
}

test("a freshly created log has no messages", () => {
  const log = new ObservationLog();
  assert.deepEqual(allMessages(log), []);
});

test("allMessages returns messages in insertion order", () => {
  const log = new ObservationLog();
  fill(log, ["dome opened", "target acquired", "guide star locked"]);

  assert.deepEqual(allMessages(log), [
    "dome opened",
    "target acquired",
    "guide star locked",
  ]);
});

test("a log longer than one page still returns every message, in order", () => {
  const log = new ObservationLog();
  const messages = Array.from({ length: 9 }, (_, i) => `entry ${i}`);
  fill(log, messages);

  assert.deepEqual(allMessages(log), messages);
});

test("an entry appended right at a page boundary is still there, in order", () => {
  const log = new ObservationLog();
  // Four entries exactly fill the first page; the fifth forces a new one.
  fill(log, ["e0", "e1", "e2", "e3", "e4"]);

  assert.deepEqual(allMessages(log), ["e0", "e1", "e2", "e3", "e4"]);
});

test("lastEntries returns the most recent entries, oldest of that group first", () => {
  const log = new ObservationLog();
  fill(log, ["a", "b", "c", "d", "e", "f"]);

  assert.deepEqual(
    lastEntries(log, 2).map((entry) => entry.message),
    ["e", "f"],
  );
});

test("lastEntries never returns more entries than the log has", () => {
  const log = new ObservationLog();
  fill(log, ["only", "two"]);

  assert.equal(lastEntries(log, 100).length, 2);
});

test("lastEntries of an empty log is empty", () => {
  const log = new ObservationLog();
  assert.deepEqual(lastEntries(log, 3), []);
});

test("findFirst returns the first entry whose message contains the needle", () => {
  const log = new ObservationLog();
  fill(log, ["clear skies", "solar flare detected", "flare subsiding"]);

  assert.equal(findFirst(log, "flare")?.message, "solar flare detected");
});

test("findFirst returns undefined when nothing matches", () => {
  const log = new ObservationLog();
  fill(log, ["clear skies", "target acquired"]);

  assert.equal(findFirst(log, "flare"), undefined);
});
