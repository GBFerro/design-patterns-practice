/** Test instrumentation, not part of either route's design: a way to ask "how many
 *  StopMetadata objects actually got constructed," without which a Flyweight exercise
 *  is just indirection with no number behind it. */
let stopMetadataAllocations = 0;

export function recordStopMetadataAllocation(): void {
  stopMetadataAllocations += 1;
}

export function resetStopMetadataAllocations(): void {
  stopMetadataAllocations = 0;
}

export function stopMetadataAllocationCount(): number {
  return stopMetadataAllocations;
}
