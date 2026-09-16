import type { Stop } from "./types.ts";

const STOPS: Record<string, Stop> = {
  "mill-ave": { id: "mill-ave", name: "Mill Ave" },
  "harbor-sq": { id: "harbor-sq", name: "Harbor Square" },
  castleview: { id: "castleview", name: "Castleview" },
};

/** Subsystem 1: turns whatever a caller typed into a real Stop, or rejects it. */
export class StopResolver {
  resolve(name: string): Stop {
    const stop = STOPS[name];
    if (!stop) throw new Error(`unknown stop: ${name}`);
    return stop;
  }
}
