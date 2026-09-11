export type Alert =
  | { readonly kind: "seeing"; readonly fwhmArcsec: number }
  | { readonly kind: "weather"; readonly condition: string };

export function describeAlert(alert: Alert): string {
  switch (alert.kind) {
    case "seeing":
      return `seeing ${alert.fwhmArcsec}"`;
    case "weather":
      return `weather: ${alert.condition}`;
  }
}

export interface AlertCenter {
  publish(alert: Alert): void;
  readonly logEntries: readonly string[];
  readonly pagerEntries: readonly string[];
  readonly domeEntries: readonly string[];
  readonly reportEntries: readonly string[];
}
