import type { ReadyLamp } from "./ready-lamp.ts";
import type { StartButton } from "./start-button.ts";

export class FocusDial {
  locked = false;
  private readyLamp!: ReadyLamp;
  private startButton!: StartButton;

  connect(readyLamp: ReadyLamp, startButton: StartButton): void {
    this.readyLamp = readyLamp;
    this.startButton = startButton;
  }

  setLocked(locked: boolean): void {
    this.locked = locked;
    this.readyLamp.refresh();
    this.startButton.refresh();
  }
}
