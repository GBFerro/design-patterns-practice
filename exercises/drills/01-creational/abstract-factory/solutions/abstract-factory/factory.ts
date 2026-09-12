import { DigitalFeeder, DigitalInkSystem, DigitalPlate } from "./parts/digital.ts";
import { OffsetFeeder, OffsetInkSystem, OffsetPlate } from "./parts/offset.ts";
import type { Feeder, InkSystem, Plate, PressFamily } from "./types.ts";

/** GoF's `AbstractFactory`. Implementing this interface means providing
 *  all three parts - TypeScript will not compile a factory that forgets
 *  one. */
export interface PressFactory {
  createPlate(): Plate;
  createInkSystem(): InkSystem;
  createFeeder(): Feeder;
}

class DigitalPressFactory implements PressFactory {
  createPlate(): Plate {
    return new DigitalPlate();
  }
  createInkSystem(): InkSystem {
    return new DigitalInkSystem();
  }
  createFeeder(): Feeder {
    return new DigitalFeeder();
  }
}

class OffsetPressFactory implements PressFactory {
  createPlate(): Plate {
    return new OffsetPlate();
  }
  createInkSystem(): InkSystem {
    return new OffsetInkSystem();
  }
  createFeeder(): Feeder {
    return new OffsetFeeder();
  }
}

const PRESS_FACTORIES: Record<PressFamily, PressFactory> = {
  digital: new DigitalPressFactory(),
  offset: new OffsetPressFactory(),
};

export function getPressFactory(family: PressFamily): PressFactory {
  return PRESS_FACTORIES[family];
}
