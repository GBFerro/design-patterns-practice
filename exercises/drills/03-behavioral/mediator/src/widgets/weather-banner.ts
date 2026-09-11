import type { ReadyLamp } from "./ready-lamp.ts";
import type { StartButton } from "./start-button.ts";

export class WeatherBanner {
  severe = false;
  private readyLamp!: ReadyLamp;
  private startButton!: StartButton;

  connect(readyLamp: ReadyLamp, startButton: StartButton): void {
    this.readyLamp = readyLamp;
    this.startButton = startButton;
  }

  setSevere(severe: boolean): void {
    this.severe = severe;
    this.readyLamp.refresh();
    this.startButton.refresh();
  }
}
