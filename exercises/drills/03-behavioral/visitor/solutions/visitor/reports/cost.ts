import type { ExposureRecord } from "../records/exposure.ts";
import type { SeeingRecord } from "../records/seeing.ts";
import type { WeatherRecord } from "../records/weather.ts";
import type { LogRecordVisitor } from "../visitor.ts";

export class CostVisitor implements LogRecordVisitor<number> {
  visitSeeing(_record: SeeingRecord): number {
    return 0;
  }

  visitWeather(_record: WeatherRecord): number {
    return 0;
  }

  visitExposure(record: ExposureRecord): number {
    return record.seconds;
  }
}
