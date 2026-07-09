import { describe, expect, it } from "vitest";
import { getGa4MeasurementId, isGa4Enabled } from "../lib/analytics";

describe("analytics", () => {
  it("uses the BuildAI GA4 measurement id by default", () => {
    expect(getGa4MeasurementId()).toBe("G-1MHT8QP7FC");
    expect(isGa4Enabled()).toBe(true);
  });
});
