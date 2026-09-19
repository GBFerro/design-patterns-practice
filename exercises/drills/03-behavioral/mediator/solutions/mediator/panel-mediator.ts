import type { ReadyLamp } from "./widgets/ready-lamp.ts";
import type { StartButton } from "./widgets/start-button.ts";

/** The one place that knows what "ready" means. Every widget reports its own
 *  changes here; nothing else talks to anything else. */
export class PanelMediator {
  private locked = false;
  private selected: string | null = null;
  private seconds = 0;
  private severe = false;

  constructor(
    private readonly readyLamp: ReadyLamp,
    private readonly startButton: StartButton,
  ) {}

  focusLockedChanged(locked: boolean): void {
    this.locked = locked;
    this.refresh();
  }

  filterChanged(selected: string | null): void {
    this.selected = selected;
    this.refresh();
  }

  exposureChanged(seconds: number): void {
    this.seconds = seconds;
    this.refresh();
  }

  weatherChanged(severe: boolean): void {
    this.severe = severe;
    this.refresh();
  }

  private refresh(): void {
    const ready =
      this.locked && this.selected !== null && this.seconds > 0 && !this.severe;
    this.readyLamp.setLit(ready);
    this.startButton.setEnabled(ready);
  }
}
