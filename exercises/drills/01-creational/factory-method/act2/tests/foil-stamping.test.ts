import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createJobFromBatchImport,
  createJobFromCounter,
  createJobFromReprint,
} from "#exercise";

const CALL_SITES = {
  counter: createJobFromCounter,
  reprint: createJobFromReprint,
  "batch import": createJobFromBatchImport,
};

for (const [siteName, createJob] of Object.entries(CALL_SITES)) {
  test(`${siteName}: foil stamping defaults to gold foil`, () => {
    const job = createJob({
      jobKind: "foil-stamping",
      customerName: "Odell & Vance",
      quantity: 30,
    });
    assert.equal(job.jobKind, "foil-stamping");
    assert.equal(job.describe(), "30 foil-stamped pieces for Odell & Vance (gold foil)");
    assert.equal(job.estimatedMinutes(), 21);
  });

  test(`${siteName}: a named foil color is honored`, () => {
    const job = createJob({
      jobKind: "foil-stamping",
      customerName: "Odell & Vance",
      quantity: 30,
      foilColor: "silver",
    });
    assert.equal(
      job.describe(),
      "30 foil-stamped pieces for Odell & Vance (silver foil)",
    );
  });

  test(`${siteName}: the time estimate grows with quantity`, () => {
    const job = createJob({
      jobKind: "foil-stamping",
      customerName: "Odell & Vance",
      quantity: 120,
    });
    assert.equal(job.estimatedMinutes(), 23);
  });
}
