import type { PanelMediator } from "../panel-mediator.ts";

export class WeatherBanner {
  severe = false;

  constructor(private readonly mediator: PanelMediator) {}

  setSevere(severe: boolean): void {
    this.severe = severe;
    this.mediator.weatherChanged(severe);
  }
}
