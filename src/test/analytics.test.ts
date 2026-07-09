import { describe, expect, it } from "vitest";
import { getGa4MeasurementId, isGa4Enabled } from "../lib/analytics";

describe("analytics", () => {
  it("is disabled when measurement id is not set", () => {
    expect(getGa4MeasurementId()).toBeUndefined();
    expect(isGa4Enabled()).toBe(false);
  });
});
