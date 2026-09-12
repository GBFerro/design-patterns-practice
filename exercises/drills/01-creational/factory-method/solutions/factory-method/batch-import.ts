import { createJob } from "./factory.ts";
import type { OrderRequest, PrintJob } from "./types.ts";

/** One row of a bulk order sheet, imported from a spreadsheet. */
export function createJobFromBatchImport(request: OrderRequest): PrintJob {
  return createJob(request);
}
