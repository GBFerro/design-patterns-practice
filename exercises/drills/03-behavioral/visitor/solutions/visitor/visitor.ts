import type { ExposureRecord } from "./records/exposure.ts";
import type { SeeingRecord } from "./records/seeing.ts";
import type { WeatherRecord } from "./records/weather.ts";

/** One method per record kind. A new report implements this interface once;
 *  a new record kind means every implementation gains a method. */
export interface LogRecordVisitor<R> {
  visitSeeing(record: SeeingRecord): R;
  visitWeather(record: WeatherRecord): R;
  visitExposure(record: ExposureRecord): R;
}
