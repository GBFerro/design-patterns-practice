[🌐 English](./README.en.md)

# Act 2 — a new consumer, one that leaves, and one that misbehaves

The four built-in consumers are not the whole story anymore. A fifth party —
not known in advance, not one of the four classes already in this file —
needs to hear about alerts too, and sometimes needs to stop hearing about
them.

**`center.subscribe(observer)`** adds an `AlertObserver` to the center.
From that point on it receives every alert `publish()` sends, exactly like
the four built-in consumers do. **`center.unsubscribe(observer)`** removes
it — alerts published afterward no longer reach it. Unsubscribing an
observer that was never subscribed (or was already removed) is a safe
no-op: it must not throw, and it must not disturb anyone else.

**One more thing, and it is the one that matters most:** a subscribed
observer whose `onAlert` throws must not take anyone else down with it.
Every other observer — built-in or subscribed, registered before or after
the one that throws — must still receive that alert. `publish()` itself
must not throw either; a broken subscriber is that subscriber's problem, not
the whole observatory's.
