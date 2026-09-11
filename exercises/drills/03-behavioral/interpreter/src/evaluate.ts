import type { SkyContext } from "./types.ts";

const FIELD_GETTERS: Record<string, (context: SkyContext) => number> = {
  altitude: (context) => context.altitudeDegrees,
  moon_phase: (context) => context.moonPhase,
  seeing: (context) => context.seeingArcsec,
};

/** A scheduling policy's constraint, written as a string like
 *  `"altitude > 30 && moon_phase < 0.3"`, checked against the sky right now. */
export function evaluateConstraint(expression: string, context: SkyContext): boolean {
  const clauses = expression.split("&&").map((clause) => clause.trim());

  for (const clause of clauses) {
    if (clause === "civil_twilight_over") {
      if (!context.civilTwilightOver) return false;
      continue;
    }
    if (clause === "dome_open") {
      if (!context.domeOpen) return false;
      continue;
    }
    if (clause === "clear") {
      if (!context.clear) return false;
      continue;
    }

    if (clause.includes(">")) {
      const parts = clause.split(">").map((part) => part.trim());
      const field = parts[0];
      const raw = parts[1];
      if (field === undefined || raw === undefined) throw new Error(`unparseable clause: ${clause}`);
      const getValue = FIELD_GETTERS[field];
      if (getValue === undefined) throw new Error(`unknown field: ${field}`);
      if (!(getValue(context) > Number(raw))) return false;
      continue;
    }

    if (clause.includes("<")) {
      const parts = clause.split("<").map((part) => part.trim());
      const field = parts[0];
      const raw = parts[1];
      if (field === undefined || raw === undefined) throw new Error(`unparseable clause: ${clause}`);
      const getValue = FIELD_GETTERS[field];
      if (getValue === undefined) throw new Error(`unknown field: ${field}`);
      if (!(getValue(context) < Number(raw))) return false;
      continue;
    }

    throw new Error(`unparseable clause: ${clause}`);
  }

  return true;
}
