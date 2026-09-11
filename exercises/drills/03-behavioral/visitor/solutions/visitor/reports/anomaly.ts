import type { ExposureRecord } from "../records/exposure.ts";
import type { SeeingRecord } from "../records/seeing.ts";
import type { WeatherRecord } from "../records/weather.ts";
import type { LogRecordVisitor } from "../visitor.ts";

export class AnomalyVisitor implements LogRecordVisitor<boolean> {
  visitSeeing(record: SeeingRecord): boolean {
    return record.fwhmArcsec > 3.0;
  }

  visitWeather(record: WeatherRecord): boolean {
    return record.severity >= 8;
  }

  visitExposure(_record: ExposureRecord): boolean {
    return false;
  }
}
