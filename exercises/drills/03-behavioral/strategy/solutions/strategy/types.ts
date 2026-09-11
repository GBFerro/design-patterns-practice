/** An approved request for telescope time on a single night. */
export interface ObservationRequest {
  readonly id: string;
  readonly targetName: string;
  /** The proposal that owns this request. One proposal may hold many. */
  readonly proposalId: string;
  /** Science value assigned by the time allocation committee: 1 (lowest) to 5 (highest). */
  readonly priority: number;
  readonly minutes: number;
  /** Altitude of the target at the start of the night, in degrees above the horizon. */
  readonly altitudeDeg: number;
}

export interface PlanEntry {
  readonly requestId: string;
  readonly targetName: string;
  /** Minutes after the start of the night's budget. */
  readonly startsAtMinute: number;
  readonly minutes: number;
}

export interface NightPlan {
  readonly policy: string;
  readonly entries: readonly PlanEntry[];
  readonly usedMinutes: number;
  /** Ids of every request that did not make the plan, in the order they were submitted. */
  readonly skipped: readonly string[];
}

export interface PlanOptions {
  readonly policy: string;
  readonly budgetMinutes: number;
}
