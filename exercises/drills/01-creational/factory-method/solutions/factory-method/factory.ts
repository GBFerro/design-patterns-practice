import { BannerJob } from "./jobs/banner.ts";
import { BrochureJob } from "./jobs/brochure.ts";
import { BusinessCardJob } from "./jobs/business-card.ts";
import type { JobKind, OrderRequest, PrintJob } from "./types.ts";

/** GoF's `Creator`. Every call site defers "which class to instantiate" to
 *  whichever subclass is registered for the order's `jobKind`. */
export abstract class JobFactory {
  abstract createJob(request: OrderRequest): PrintJob;
}

class BusinessCardJobFactory extends JobFactory {
  createJob(request: OrderRequest): PrintJob {
    return new BusinessCardJob(request.customerName, request.quantity, request.doubleSided ?? false);
  }
}

class BrochureJobFactory extends JobFactory {
  createJob(request: OrderRequest): PrintJob {
    return new BrochureJob(request.customerName, request.quantity, request.foldType ?? "bi");
  }
}

class BannerJobFactory extends JobFactory {
  createJob(request: OrderRequest): PrintJob {
    return new BannerJob(request.customerName, request.quantity, request.widthCm ?? 90);
  }
}

/** The one place a `jobKind` string becomes a concrete factory. Every call
 *  site goes through this table instead of its own `switch`. */
const JOB_FACTORIES: Record<JobKind, JobFactory> = {
  "business-cards": new BusinessCardJobFactory(),
  brochure: new BrochureJobFactory(),
  banner: new BannerJobFactory(),
};

export function createJob(request: OrderRequest): PrintJob {
  return JOB_FACTORIES[request.jobKind].createJob(request);
}
