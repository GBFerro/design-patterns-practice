/** One entry in the night's log. Every concrete record has to answer all
 *  three reductions below, about itself. */
export abstract class LogRecord {
  abstract toLine(): string;
  abstract costSeconds(): number;
  abstract isAnomaly(): boolean;
}
