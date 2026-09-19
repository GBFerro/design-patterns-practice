export type Direction = "north" | "south" | "east" | "west";

export type RobotCommand =
  | { readonly kind: "move"; readonly direction: Direction }
  | { readonly kind: "pickUp"; readonly itemId: string }
  | { readonly kind: "dropOff" };

export interface RobotState {
  readonly x: number;
  readonly y: number;
  readonly holding: string | null;
}

export interface BatchFailure {
  readonly failedIndex: number;
  readonly reason: string;
}

export interface BatchResult {
  readonly state: RobotState;
  readonly failure: BatchFailure | null;
}
