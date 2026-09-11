import type { ExposureTimer } from "./exposure-timer.ts";
import type { FilterWheel } from "./filter-wheel.ts";
import type { FocusDial } from "./focus-dial.ts";
import type { WeatherBanner } from "./weather-banner.ts";

export class ReadyLamp {
  private _lit = false;

  constructor(
    private readonly focusDial: FocusDial,
    private readonly filterWheel: FilterWheel,
    private readonly exposureTimer: ExposureTimer,
    private readonly weatherBanner: WeatherBanner,
  ) {}

  refresh(): void {
    this._lit =
      this.focusDial.locked &&
      this.filterWheel.selected !== null &&
      this.exposureTimer.seconds > 0 &&
      !this.weatherBanner.severe;
  }

  get lit(): boolean {
    return this._lit;
  }
}
