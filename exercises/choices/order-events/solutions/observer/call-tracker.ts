const calls: string[] = [];

/** Called by every consumer, so any route's fan-out is observable in tests. */
export function recordCall(name: string): void {
  calls.push(name);
}

export function calledConsumers(): readonly string[] {
  return [...calls];
}

export function resetCalls(): void {
  calls.length = 0;
}
