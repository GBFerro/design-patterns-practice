import assert from "node:assert/strict";
import { test } from "node:test";

import { createAlertCenter } from "#exercise";
import type { Alert } from "#exercise";

class RecordingObserver {
  readonly received: Alert[] = [];

  onAlert(alert: Alert): void {
    this.received.push(alert);
  }
}

class ThrowingObserver {
  onAlert(): void {
    throw new Error("dispatcher is offline");
  }
}

test("a subscribed observer receives a published alert", () => {
  const center = createAlertCenter();
  const observer = new RecordingObserver();
  center.subscribe(observer);

  center.publish({ kind: "seeing", fwhmArcsec: 2.2 });

  assert.deepEqual(observer.received, [{ kind: "seeing", fwhmArcsec: 2.2 }]);
});

test("a subscribed observer does not stop the built-in consumers from receiving the same alert", () => {
  const center = createAlertCenter();
  center.subscribe(new RecordingObserver());

  center.publish({ kind: "weather", condition: "hail" });

  assert.deepEqual(center.logEntries, ["weather: hail"]);
  assert.deepEqual(center.domeEntries, ["closed: hail"]);
});

test("two independently subscribed observers both receive the same alert", () => {
  const center = createAlertCenter();
  const first = new RecordingObserver();
  const second = new RecordingObserver();
  center.subscribe(first);
  center.subscribe(second);

  center.publish({ kind: "seeing", fwhmArcsec: 1.4 });

  assert.deepEqual(first.received, second.received);
  assert.equal(first.received.length, 1);
});

test("unsubscribing stops an observer from receiving future alerts", () => {
  const center = createAlertCenter();
  const observer = new RecordingObserver();
  center.subscribe(observer);

  center.publish({ kind: "seeing", fwhmArcsec: 1.0 });
  center.unsubscribe(observer);
  center.publish({ kind: "seeing", fwhmArcsec: 2.0 });

  assert.deepEqual(observer.received, [{ kind: "seeing", fwhmArcsec: 1.0 }]);
});

test("unsubscribing one observer does not affect another still-subscribed observer", () => {
  const center = createAlertCenter();
  const staying = new RecordingObserver();
  const leaving = new RecordingObserver();
  center.subscribe(staying);
  center.subscribe(leaving);

  center.unsubscribe(leaving);
  center.publish({ kind: "weather", condition: "fog" });

  assert.equal(staying.received.length, 1);
  assert.equal(leaving.received.length, 0);
});

test("unsubscribing an observer that was never subscribed is a safe no-op", () => {
  const center = createAlertCenter();
  const neverSubscribed = new RecordingObserver();
  const subscribed = new RecordingObserver();
  center.subscribe(subscribed);

  assert.doesNotThrow(() => center.unsubscribe(neverSubscribed));

  center.publish({ kind: "seeing", fwhmArcsec: 1.7 });
  assert.equal(subscribed.received.length, 1);
});

test("a throwing observer does not stop other subscribed observers from receiving the alert", () => {
  const center = createAlertCenter();
  const before = new RecordingObserver();
  const after = new RecordingObserver();
  center.subscribe(before);
  center.subscribe(new ThrowingObserver());
  center.subscribe(after);

  center.publish({ kind: "seeing", fwhmArcsec: 2.9 });

  assert.equal(before.received.length, 1);
  assert.equal(after.received.length, 1);
});

test("a throwing observer does not stop the built-in consumers from receiving the alert", () => {
  const center = createAlertCenter();
  center.subscribe(new ThrowingObserver());

  center.publish({ kind: "weather", condition: "ash" });

  assert.deepEqual(center.logEntries, ["weather: ash"]);
  assert.deepEqual(center.pagerEntries, ["weather: ash"]);
  assert.deepEqual(center.domeEntries, ["closed: ash"]);
  assert.deepEqual(center.reportEntries, ["weather: ash"]);
});

test("publish() itself does not throw when a subscribed observer throws", () => {
  const center = createAlertCenter();
  center.subscribe(new ThrowingObserver());

  assert.doesNotThrow(() => center.publish({ kind: "seeing", fwhmArcsec: 1.1 }));
});
