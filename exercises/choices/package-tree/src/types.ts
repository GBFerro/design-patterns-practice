export interface Item {
  readonly kind: "item";
  readonly sku: string;
  readonly weightKg: number;
  readonly volumeM3: number;
}

export interface Carton {
  readonly kind: "carton";
  readonly label: string;
  readonly children: readonly PackageNode[];
}

export type PackageNode = Item | Carton;
