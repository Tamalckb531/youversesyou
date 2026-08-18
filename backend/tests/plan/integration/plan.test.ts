import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { app } from "../../../src";
import { getDb } from "../../../src/db";
import { plans } from "../../../src/db/schema";
import { responseMsg } from "../../../src/lib/constants";
import { TEST_USER } from "../../../src/test-data";
import {
    INSERT_OVERALL_PLAN_ARRAY,
    INSERT_YEARLY_PLAN_ARRAY,
    TEST_PLAN_IDS,
    UPDATE_PLAN_BODY,
} from "../../../src/data/plan-test-data";

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
            "aaaaaaaa-1111-4111-8111-111111111111";

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

// describe("POST /api/v1/plans/", () => {
//     it("should create overall plans linked to reflections", async () => {
//         const res = await app.request("/api/v1/plans/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(INSERT_OVERALL_PLAN_ARRAY),
//         });

//         expect(res.status).toBe(201);

//         const body = await res.json();

//         expect(body.success).toBe(true);
//         expect(body.msg).toBe(responseMsg.plan.success.CREATED_BULK);
//         expect(body.data).toHaveLength(1);

//         const [createdPlan] = body.data;

//         expect(createdPlan.id).toBeDefined();
//         expect(createdPlan.userId).toBe(TEST_USER.id);
//         expect(createdPlan.type).toBe("overall");
//         expect(createdPlan.time).toBeNull();
//         expect(createdPlan.status).toBe("active");
//         expect(createdPlan.linkedIds).toEqual(
//             expect.arrayContaining(INSERT_OVERALL_PLAN_ARRAY[0].junctionIdArray),
//         );
//     });

//     it("should create yearly plans linked to overall parent plans", async () => {
//         const res = await app.request("/api/v1/plans/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(INSERT_YEARLY_PLAN_ARRAY),
//         });

//         expect(res.status).toBe(201);

//         const body = await res.json();

//         expect(body.success).toBe(true);
//         expect(body.msg).toBe(responseMsg.plan.success.CREATED_BULK);
//         expect(body.data).toHaveLength(1);

//         const [createdPlan] = body.data;

//         expect(createdPlan.userId).toBe(TEST_USER.id);
//         expect(createdPlan.type).toBe("yearly");
//         expect(createdPlan.time).toBe("2028");
//         expect(createdPlan.linkedIds).toEqual([TEST_PLAN_IDS[0]]);
//     });

//     it("should return error when junction ids are invalid", async () => {
//         const res = await app.request("/api/v1/plans/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify([
//                 {
//                     ...INSERT_OVERALL_PLAN_ARRAY[0],
//                     junctionIdArray: [
//                         "aaaaaaaa-1111-4111-8111-111111111111",
//                     ],
//                 },
//             ]),
//         });

//         expect(res.status).toBe(400);

//         const body = await res.json();

//         expect(body.success).toBe(false);
//         expect(body.msg).toBe(responseMsg.plan.error.INVALID_JUNCTION_IDS);
//         expect(body.data).toBeNull();
//     });

//     it("should return error when parent plan type is invalid", async () => {
//         const res = await app.request("/api/v1/plans/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify([
//                 {
//                     title: "Bad Yearly Plan",
//                     description: "Linked to monthly instead of overall",
//                     type: "yearly",
//                     time: "2028",
//                     status: "active",
//                     junctionIdArray: [TEST_PLAN_IDS[4]],
//                 },
//             ]),
//         });

//         expect(res.status).toBe(400);

//         const body = await res.json();

//         expect(body.success).toBe(false);
//         expect(body.msg).toBe(responseMsg.plan.error.INVALID_PARENT_TYPE);
//         expect(body.data).toBeNull();
//     });
// });

// describe("PATCH /api/v1/plans/:id", () => {
//     it("should update a plan title and description", async () => {
//         const planId = TEST_PLAN_IDS[0];

//         const res = await app.request(`/api/v1/plans/${planId}`, {
//             method: "PATCH",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(UPDATE_PLAN_BODY),
//         });

//         expect(res.status).toBe(201);

//         const body = await res.json();

//         expect(body.success).toBe(true);
//         expect(body.msg).toBe(responseMsg.plan.success.UPDATE_ONE);
//         expect(body.data.title).toBe(UPDATE_PLAN_BODY.title);
//         expect(body.data.description).toBe(UPDATE_PLAN_BODY.description);

//         const [updatedPlan] = await getDb()
//             .select({
//                 id: plans.id,
//                 title: plans.title,
//                 description: plans.description,
//                 userId: plans.userId,
//             })
//             .from(plans)
//             .where(eq(plans.id, planId));

//         expect(updatedPlan.id).toBe(planId);
//         expect(updatedPlan.title).toBe(UPDATE_PLAN_BODY.title);
//         expect(updatedPlan.description).toBe(UPDATE_PLAN_BODY.description);
//         expect(updatedPlan.userId).toBe(TEST_USER.id);
//     });

//     it("should return error when plan id is invalid", async () => {
//         const invalidPlanId = "aaaaaaaa-1111-4111-8111-111111111111";

//         const res = await app.request(`/api/v1/plans/${invalidPlanId}`, {
//             method: "PATCH",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(UPDATE_PLAN_BODY),
//         });

//         expect(res.status).toBe(500);

//         const body = await res.json();

//         expect(body.success).toBe(false);
//         expect(body.msg).toBe(responseMsg.plan.error.NO_PLAN_ID);
//         expect(body.data).toBeNull();
//     });

//     it("should return error when request body is invalid", async () => {
//         const res = await app.request(`/api/v1/plans/${TEST_PLAN_IDS[0]}`, {
//             method: "PATCH",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ title: "" }),
//         });

//         expect(res.status).toBe(400);

//         const body = await res.json();

//         expect(body.success).toBe(false);
//         expect(body.data).toBeNull();
//     });
// });