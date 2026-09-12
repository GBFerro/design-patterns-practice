import { createJob } from "./factory.ts";
import type { OrderRequest, PrintJob } from "./types.ts";

/** A previous job, run again from the same order details. */
export function createJobFromReprint(request: OrderRequest): PrintJob {
  return createJob(request);
}
