import { describe, expect, it } from "vitest";
import { app } from "../../../src";
import { responseMsg } from "../../../src/lib/constants";
import { TEST_USER } from "../../../src/test-data";
import { TEST_PLAN_IDS } from "../../../src/data/plan-test-data";

describe("GET /api/v1/plans", () => {
    it("should return all plans of the test user", async () => {
        const res = await app.request("/api/v1/plans/", {
            method: "GET",
        });

        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.plan.success.GET_ALL);

        expect(body.data).toHaveLength(8);

        expect(
            body.data.every((plan: any) => plan.userId === TEST_USER.id)
        ).toBe(true);

        expect(body.data.map((plan: any) => plan.id)).toEqual(
            expect.arrayContaining([...TEST_PLAN_IDS])
        );
    });
});