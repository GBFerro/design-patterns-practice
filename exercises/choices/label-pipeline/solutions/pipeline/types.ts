export interface Shipment {
  readonly orderId: string;
  readonly address: string;
  readonly weightKg: number;
  readonly destinationCountry: string;
  readonly fragile: boolean;
  readonly hazmat: boolean;
}
