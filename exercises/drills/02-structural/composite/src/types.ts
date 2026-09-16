export class Stop {
  constructor(
    public readonly name: string,
    public readonly dwellMinutes: number,
  ) {}
}

export class Segment {
  constructor(public readonly travelMinutes: number) {}
}

export class Line {
  constructor(
    public readonly name: string,
    public readonly children: readonly RouteNode[],
  ) {}
}

export class Journey {
  constructor(public readonly children: readonly RouteNode[]) {}
}

export type RouteNode = Stop | Segment | Line | Journey;
