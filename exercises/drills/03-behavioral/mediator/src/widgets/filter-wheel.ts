import type { ReadyLamp } from "./ready-lamp.ts";
import type { StartButton } from "./start-button.ts";

export class FilterWheel {
  selected: string | null = null;
  private readyLamp!: ReadyLamp;
  private startButton!: StartButton;

  connect(readyLamp: ReadyLamp, startButton: StartButton): void {
    this.readyLamp = readyLamp;
    this.startButton = startButton;
  }

  setSelected(selected: string | null): void {
    this.selected = selected;
    this.readyLamp.refresh();
    this.startButton.refresh();
  }
}
