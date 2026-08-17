import { describe, expect, it } from "vitest";
import { app } from "../../../src";
import { responseMsg } from "../../../src/lib/constants";
import { TEST_MIDDLEWARE_USER, TEST_USER } from "../../../src/test-data";
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

describe("GET /api/v1/plans/:id", () => {
    it("should return an overall plan with related reflections", async () => {
        const planId = TEST_PLAN_IDS[0];

        const res = await app.request(`/api/v1/plans/${planId}`, {
            method: "GET",
        });

        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.plan.success.GET_ONE);

        expect(body.data.plan).toMatchObject({
            id: planId,
            userId: TEST_USER.id,
            title: "Overall Plan 1",
            type: "overall",
            time: null,
            status: "active",
        });

        expect(Array.isArray(body.data.relatedConnections)).toBe(true);
        expect(body.data.relatedConnections).toHaveLength(2);

        expect(
            body.data.relatedConnections.every(
                (reflection: any) =>
                    reflection.userId === TEST_USER.id
            )
        ).toBe(true);
    });

    it("should return a monthly plan with related yearly plans", async () => {
        const planId = TEST_PLAN_IDS[4];

        const res = await app.request(`/api/v1/plans/${planId}`, {
            method: "GET",
        });

        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.plan.success.GET_ONE);

        expect(body.data.plan).toMatchObject({
            id: planId,
            userId: TEST_USER.id,
            title: "Monthly Plan 1",
            type: "monthly",
            time: "Jan",
            status: "active",
        });

        expect(Array.isArray(body.data.relatedConnections)).toBe(true);
        expect(body.data.relatedConnections).toHaveLength(2);

        expect(
            body.data.relatedConnections.every(
                (plan: any) =>
                    plan.userId === TEST_USER.id &&
                    plan.type === "yearly"
            )
        ).toBe(true);
    });

    it("should return error when plan id is invalid", async () => {
        const invalidPlanId =
            "aaaaaaaa-1111-1111-1111-111111111111";

        const res = await app.request(
            `/api/v1/plans/${invalidPlanId}`,
            {
                method: "GET",
            }
        );

        expect(res.status).toBe(500);

        const body = await res.json();

        expect(body.success).toBe(false);
        expect(body.msg).toBe(responseMsg.plan.error.NO_PLAN_ID);
        expect(body.data).toBeNull();
    });
});