import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createJobFromBatchImport,
  createJobFromCounter,
  createJobFromReprint,
  type OrderRequest,
} from "#exercise";

const CALL_SITES = {
  counter: createJobFromCounter,
  reprint: createJobFromReprint,
  "batch import": createJobFromBatchImport,
};

for (const [siteName, createJob] of Object.entries(CALL_SITES)) {
  test(`${siteName}: business cards describe themselves and estimate their own time`, () => {
    const job = createJob({
      jobKind: "business-cards",
      customerName: "Rowan Ito",
      quantity: 250,
    });
    assert.equal(job.jobKind, "business-cards");
    assert.equal(job.describe(), "250 business cards for Rowan Ito");
    assert.equal(job.estimatedMinutes(), 5);
  });

  test(`${siteName}: double-sided business cards cost more time and say so`, () => {
    const job = createJob({
      jobKind: "business-cards",
      customerName: "Rowan Ito",
      quantity: 250,
      doubleSided: true,
    });
    assert.equal(job.describe(), "250 business cards for Rowan Ito (double-sided)");
    assert.equal(job.estimatedMinutes(), 8);
  });

  test(`${siteName}: a brochure defaults to bi-fold`, () => {
    const job = createJob({
      jobKind: "brochure",
      customerName: "Priya Nair",
      quantity: 40,
    });
    assert.equal(job.describe(), "40 bi-fold brochures for Priya Nair");
    assert.equal(job.estimatedMinutes(), 8);
  });

  test(`${siteName}: a tri-fold brochure costs more time`, () => {
    const job = createJob({
      jobKind: "brochure",
      customerName: "Priya Nair",
      quantity: 40,
      foldType: "tri",
    });
    assert.equal(job.describe(), "40 tri-fold brochures for Priya Nair");
    assert.equal(job.estimatedMinutes(), 12);
  });

  test(`${siteName}: a banner defaults to 90cm wide`, () => {
    const job = createJob({
      jobKind: "banner",
      customerName: "Delacroix Signs",
      quantity: 2,
    });
    assert.equal(job.describe(), "2 banner(s), 90cm wide, for Delacroix Signs");
    assert.equal(job.estimatedMinutes(), 18);
  });

  test(`${siteName}: a wider banner costs more time`, () => {
    const job = createJob({
      jobKind: "banner",
      customerName: "Delacroix Signs",
      quantity: 2,
      widthCm: 180,
    });
    assert.equal(job.estimatedMinutes(), 21);
  });
}

test("the three call sites agree on every field for the same order", () => {
  const request: OrderRequest = {
    jobKind: "brochure",
    customerName: "Priya Nair",
    quantity: 40,
    foldType: "tri",
  };
  const jobs = [
    createJobFromCounter(request),
    createJobFromReprint(request),
    createJobFromBatchImport(request),
  ];
  const descriptions = jobs.map((job) => job.describe());
  assert.deepEqual(descriptions, [descriptions[0], descriptions[0], descriptions[0]]);
});
