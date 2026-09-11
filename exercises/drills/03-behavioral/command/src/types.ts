export type ActionRecord =
  | { readonly type: "move-focuser"; readonly deltaMicrons: number }
  | { readonly type: "rotate-wheel"; readonly toSlot: number };

export interface InstrumentPanel {
  readonly focuserPosition: number;
  readonly filterSlot: number;
  readonly history: readonly string[];
  run(action: ActionRecord): void;
}
