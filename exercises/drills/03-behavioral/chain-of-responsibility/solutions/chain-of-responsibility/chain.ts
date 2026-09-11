import { AltitudeRule } from "./rules/altitude.ts";
import { DomeClearanceRule } from "./rules/dome-clearance.ts";
import { ExposureBudgetRule } from "./rules/exposure-budget.ts";
import { InstrumentAvailableRule } from "./rules/instrument-available.ts";
import { MoonSeparationRule } from "./rules/moon-separation.ts";
import { WeatherRule } from "./rules/weather.ts";
import type { ValidationRule } from "./rule.ts";
import type { Telescope } from "./types.ts";

/** The one place that decides, per telescope, which rules apply and in
 *  what order. */
export function buildChain(telescope: Telescope): ValidationRule {
  const altitude = new AltitudeRule();
  const moon = new MoonSeparationRule();
  const instrument = new InstrumentAvailableRule();
  const exposure = new ExposureBudgetRule();
  const weather = new WeatherRule();

  altitude.setNext(moon).setNext(instrument).setNext(exposure);

  if (telescope.hasMovableDome) {
    exposure.setNext(new DomeClearanceRule()).setNext(weather);
  } else {
    exposure.setNext(weather);
  }

  return altitude;
}
