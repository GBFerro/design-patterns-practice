export interface Order {
  readonly id: string;
  readonly binId: string;
  readonly queuedAt: number;
}

export interface PickInstruction {
  readonly mode: "individual" | "batch";
  readonly binId: string;
  readonly orderIds: readonly string[];
}
