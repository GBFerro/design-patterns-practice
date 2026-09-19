import type { BatchResult, Direction, RobotCommand, RobotState } from "./types.ts";

const GRID_MAX = 9;

function moveDelta(direction: Direction): { dx: number; dy: number } {
  if (direction === "north") return { dx: 0, dy: -1 };
  if (direction === "south") return { dx: 0, dy: 1 };
  if (direction === "east") return { dx: 1, dy: 0 };
  return { dx: -1, dy: 0 };
}

const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

/**
 * Process one command arriving from the live stream: validate it against the
 * robot's current position and cargo, then apply its effect.
 */
export function runCommand(state: RobotState, command: RobotCommand): RobotState {
  // validate
  if (command.kind === "move") {
    const { dx, dy } = moveDelta(command.direction);
    const nextX = state.x + dx;
    const nextY = state.y + dy;
    if (nextX < 0 || nextX > GRID_MAX || nextY < 0 || nextY > GRID_MAX) {
      throw new Error(
        `move ${command.direction} would leave the grid at (${nextX}, ${nextY})`,
      );
    }
  } else if (command.kind === "pickUp") {
    if (state.holding !== null) {
      throw new Error(
        `already holding ${state.holding}, cannot pick up ${command.itemId}`,
      );
    }
  } else {
    if (state.holding === null) {
      throw new Error("not holding anything to drop off");
    }
  }

  // apply
  if (command.kind === "move") {
    const { dx, dy } = moveDelta(command.direction);
    return { ...state, x: state.x + dx, y: state.y + dy };
  }
  if (command.kind === "pickUp") {
    return { ...state, holding: command.itemId };
  }
  return { ...state, holding: null };
}

/**
 * Replay a batch of commands from a persisted log against the robot's
 * current state. The batch keeps only the minimal fact each applied command
 * needs to be undone later - not a full state history - because a replayed
 * batch can be arbitrarily long. If a command partway through is illegal,
 * every command already applied in this batch is rolled back, in reverse
 * order, and the batch reports which index failed and why.
 */
export function replayBatch(
  state: RobotState,
  commands: readonly RobotCommand[],
): BatchResult {
  const journal: {
    readonly command: RobotCommand;
    readonly priorHolding: string | null;
  }[] = [];
  let current = state;

  for (let i = 0; i < commands.length; i++) {
    const command = commands[i]!;
    try {
      // validate
      if (command.kind === "move") {
        const { dx, dy } = moveDelta(command.direction);
        const nextX = current.x + dx;
        const nextY = current.y + dy;
        if (nextX < 0 || nextX > GRID_MAX || nextY < 0 || nextY > GRID_MAX) {
          throw new Error(
            `move ${command.direction} would leave the grid at (${nextX}, ${nextY})`,
          );
        }
      } else if (command.kind === "pickUp") {
        if (current.holding !== null) {
          throw new Error(
            `already holding ${current.holding}, cannot pick up ${command.itemId}`,
          );
        }
      } else {
        if (current.holding === null) {
          throw new Error("not holding anything to drop off");
        }
      }

      journal.push({ command, priorHolding: current.holding });

      // apply
      if (command.kind === "move") {
        const { dx, dy } = moveDelta(command.direction);
        current = { ...current, x: current.x + dx, y: current.y + dy };
      } else if (command.kind === "pickUp") {
        current = { ...current, holding: command.itemId };
      } else {
        current = { ...current, holding: null };
      }
    } catch (err) {
      let rollback = current;
      for (let j = journal.length - 1; j >= 0; j--) {
        const entry = journal[j]!;

        // invert
        let inverse: RobotCommand;
        if (entry.command.kind === "move") {
          inverse = {
            kind: "move",
            direction: OPPOSITE_DIRECTION[entry.command.direction],
          };
        } else if (entry.command.kind === "pickUp") {
          inverse = { kind: "dropOff" };
        } else {
          if (entry.priorHolding === null) {
            throw new Error("cannot invert a dropOff that had nothing held before it", {
              cause: err,
            });
          }
          inverse = { kind: "pickUp", itemId: entry.priorHolding };
        }

        // apply
        if (inverse.kind === "move") {
          const { dx, dy } = moveDelta(inverse.direction);
          rollback = { ...rollback, x: rollback.x + dx, y: rollback.y + dy };
        } else if (inverse.kind === "pickUp") {
          rollback = { ...rollback, holding: inverse.itemId };
        } else {
          rollback = { ...rollback, holding: null };
        }
      }
      const reason = err instanceof Error ? err.message : String(err);
      return { state: rollback, failure: { failedIndex: i, reason } };
    }
  }

  return { state: current, failure: null };
}

/**
 * Undo the single most recent command issued through `runCommand`, given
 * what the robot was holding right before it. Used by the operator's undo
 * button - one level of history, not a batch rollback.
 */
export function undoLast(
  currentState: RobotState,
  lastCommand: RobotCommand,
  priorHolding: string | null,
): RobotState {
  // invert
  let inverse: RobotCommand;
  if (lastCommand.kind === "move") {
    inverse = { kind: "move", direction: OPPOSITE_DIRECTION[lastCommand.direction] };
  } else if (lastCommand.kind === "pickUp") {
    inverse = { kind: "dropOff" };
  } else {
    if (priorHolding === null) {
      throw new Error("cannot invert a dropOff that had nothing held before it");
    }
    inverse = { kind: "pickUp", itemId: priorHolding };
  }

  // apply
  if (inverse.kind === "move") {
    const { dx, dy } = moveDelta(inverse.direction);
    return { ...currentState, x: currentState.x + dx, y: currentState.y + dy };
  }
  if (inverse.kind === "pickUp") {
    return { ...currentState, holding: inverse.itemId };
  }
  return { ...currentState, holding: null };
}
