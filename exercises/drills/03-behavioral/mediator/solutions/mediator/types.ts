export interface ControlPanel {
  setFocusLocked(locked: boolean): void;
  setFilter(selected: string | null): void;
  setExposureSeconds(seconds: number): void;
  setWeatherSevere(severe: boolean): void;
  readonly readyLampLit: boolean;
  readonly startButtonEnabled: boolean;
}
