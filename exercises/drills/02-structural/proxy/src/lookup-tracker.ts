/** Test instrumentation, not part of either route's design: a way to ask "how many
 *  times did the real, expensive lookup actually run." */
let lookups = 0;

export function recordRealLookup(): void {
  lookups += 1;
}

export function resetRealLookupCount(): void {
  lookups = 0;
}

export function realLookupCount(): number {
  return lookups;
}
