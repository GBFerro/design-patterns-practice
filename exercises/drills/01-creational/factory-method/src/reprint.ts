import { BannerJob } from "./jobs/banner.ts";
import { BrochureJob } from "./jobs/brochure.ts";
import { BusinessCardJob } from "./jobs/business-card.ts";
import type { OrderRequest, PrintJob } from "./types.ts";

/** A previous job, run again from the same order details. */
export function createJobFromReprint(request: OrderRequest): PrintJob {
  switch (request.jobKind) {
    case "business-cards":
      return new BusinessCardJob(
        request.customerName,
        request.quantity,
        request.doubleSided ?? false,
      );
    case "brochure":
      return new BrochureJob(
        request.customerName,
        request.quantity,
        request.foldType ?? "bi",
      );
    case "banner":
      return new BannerJob(request.customerName, request.quantity, request.widthCm ?? 90);
  }
}
