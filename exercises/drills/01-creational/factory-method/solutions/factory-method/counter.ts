import { createJob } from "./factory.ts";
import type { OrderRequest, PrintJob } from "./types.ts";

/** A customer standing at the counter, ordering a job right now. */
export function createJobFromCounter(request: OrderRequest): PrintJob {
  return createJob(request);
}
