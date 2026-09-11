import type { ReadyLamp } from "./ready-lamp.ts";
import type { StartButton } from "./start-button.ts";

export class ExposureTimer {
  seconds = 0;
  private readyLamp!: ReadyLamp;
  private startButton!: StartButton;

  connect(readyLamp: ReadyLamp, startButton: StartButton): void {
    this.readyLamp = readyLamp;
    this.startButton = startButton;
  }

  setSeconds(seconds: number): void {
    this.seconds = seconds;
    this.readyLamp.refresh();
    this.startButton.refresh();
  }
}
