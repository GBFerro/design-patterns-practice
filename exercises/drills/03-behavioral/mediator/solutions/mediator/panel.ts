import { PanelMediator } from "./panel-mediator.ts";
import type { ControlPanel } from "./types.ts";
import { ExposureTimer } from "./widgets/exposure-timer.ts";
import { FilterWheel } from "./widgets/filter-wheel.ts";
import { FocusDial } from "./widgets/focus-dial.ts";
import { ReadyLamp } from "./widgets/ready-lamp.ts";
import { StartButton } from "./widgets/start-button.ts";
import { WeatherBanner } from "./widgets/weather-banner.ts";

class ConcreteControlPanel implements ControlPanel {
  private readonly readyLamp = new ReadyLamp();
  private readonly startButton = new StartButton();
  private readonly mediator = new PanelMediator(this.readyLamp, this.startButton);
  private readonly focusDial = new FocusDial(this.mediator);
  private readonly filterWheel = new FilterWheel(this.mediator);
  private readonly exposureTimer = new ExposureTimer(this.mediator);
  private readonly weatherBanner = new WeatherBanner(this.mediator);

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
