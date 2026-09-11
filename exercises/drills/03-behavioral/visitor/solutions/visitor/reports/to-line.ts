import type { ExposureRecord } from "../records/exposure.ts";
import type { SeeingRecord } from "../records/seeing.ts";
import type { WeatherRecord } from "../records/weather.ts";
import type { LogRecordVisitor } from "../visitor.ts";

export class ToLineVisitor implements LogRecordVisitor<string> {
  visitSeeing(record: SeeingRecord): string {
    return `seeing ${record.fwhmArcsec.toFixed(1)}"`;
  }

  visitWeather(record: WeatherRecord): string {
    return `weather: ${record.condition} (severity ${record.severity})`;
  }

  visitExposure(record: ExposureRecord): string {
    return `exposure ${record.seconds}s on ${record.instrumentName}`;
  }
}
