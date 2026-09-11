import { ExposureTimer } from "./widgets/exposure-timer.ts";
import { FilterWheel } from "./widgets/filter-wheel.ts";
import { FocusDial } from "./widgets/focus-dial.ts";
import { ReadyLamp } from "./widgets/ready-lamp.ts";
import { StartButton } from "./widgets/start-button.ts";
import { WeatherBanner } from "./widgets/weather-banner.ts";
import type { ControlPanel } from "./types.ts";

class ConcreteControlPanel implements ControlPanel {
  private readonly focusDial = new FocusDial();
  private readonly filterWheel = new FilterWheel();
  private readonly exposureTimer = new ExposureTimer();
  private readonly weatherBanner = new WeatherBanner();
  private readonly readyLamp = new ReadyLamp(
    this.focusDial,
    this.filterWheel,
    this.exposureTimer,
    this.weatherBanner,
  );
  private readonly startButton = new StartButton(
    this.focusDial,
    this.filterWheel,
    this.exposureTimer,
    this.weatherBanner,
  );

  constructor() {
    this.focusDial.connect(this.readyLamp, this.startButton);
    this.filterWheel.connect(this.readyLamp, this.startButton);
    this.exposureTimer.connect(this.readyLamp, this.startButton);
    this.weatherBanner.connect(this.readyLamp, this.startButton);
  }

  setFocusLocked(locked: boolean): void {
    this.focusDial.setLocked(locked);
  }

  setFilter(selected: string | null): void {
    this.filterWheel.setSelected(selected);
  }

  setExposureSeconds(seconds: number): void {
    this.exposureTimer.setSeconds(seconds);
  }

  setWeatherSevere(severe: boolean): void {
    this.weatherBanner.setSevere(severe);
  }

  get readyLampLit(): boolean {
    return this.readyLamp.lit;
  }

  get startButtonEnabled(): boolean {
    return this.startButton.enabled;
  }
}

export function createControlPanel(): ControlPanel {
  return new ConcreteControlPanel();
}
