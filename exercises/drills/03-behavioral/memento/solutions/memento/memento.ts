/** What a caretaker holds: an opaque token, not a record. Nothing on this
 *  interface is readable - that is the whole point. */
export interface ExposureMemento {}

/** What the token above actually holds. Only `setup.ts` imports this by its
 *  concrete name - everyone else only ever sees `ExposureMemento`. */
export class ConcreteExposureMemento implements ExposureMemento {
  constructor(
    readonly instrumentName: string,
    readonly filterName: string,
    readonly exposureSeconds: number,
    readonly binning: string,
  ) {}
}
