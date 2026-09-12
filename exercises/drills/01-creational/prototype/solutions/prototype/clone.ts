import { TEMPLATES } from "./templates.ts";
import type { JobTemplate, TemplateName } from "./types.ts";

// `structuredClone` is a platform global (every current Node and every
// browser has it), not a language feature the "ES2023" lib declares - and
// this repo's exercise typecheck runs with no ambient types installed at
// all. One honest ambient declaration, rather than pulling in the DOM lib
// repo-wide for one function.
declare function structuredClone<T>(value: T): T;

/** Copies a saved template by asking the platform to copy it, field by
 *  field, whatever those fields happen to be - nothing here names a single
 *  property of JobTemplate. */
export function cloneTemplate(name: TemplateName): JobTemplate {
  return structuredClone(TEMPLATES[name]);
}
