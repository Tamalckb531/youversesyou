import { describe, expect, it } from "vitest";
import { app } from "../../../src";
import { responseMsg } from "../../../src/lib/constants";
import { TEST_USER } from "../../../src/test-data";
import { INSERT_HABIT } from "../../../src/data/habit-test.data";

const rootRoute = "habits"

describe("GET /api/v1/habits/", () => {
    it("should return all habits of the test users", async () => {
        const res = await app.request(`/api/v1/${rootRoute}/`, {
            method: "GET",
        })
        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.habit.success.GET_ALL);

        expect(body.data.every((r: any) => r.userId === TEST_USER.id)).toBe(true);
    });
});

describe("POST /api/v1/habits/", () => {
    it("should create habit linked to reflections", async () => {
        const res = await app.request(`/api/v1/${rootRoute}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(INSERT_HABIT),
        });

        expect(res.status).toBe(201);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.habit.success.CREATED_BULK);
        expect(body.data).toBeTypeOf("object");

        const createdPlan = body.data;

        expect(createdPlan.id).toBeDefined();
        expect(createdPlan.userId).toBe(TEST_USER.id);
        expect(createdPlan.isArchived).toBe(false);
        expect(createdPlan.linkedIds).toEqual(
            expect.arrayContaining(INSERT_HABIT.junctionIdArray),
        );
    });

    it("should return error when junction ids are invalid", async () => {
        const res = await app.request(`/api/v1/${rootRoute}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    ...INSERT_HABIT,
                    junctionIdArray: [
                        "9f0817cc-0d19-42b9-9128-695d22deaf99",
                    ],
                },
            ),
        });

        expect(res.status).toBe(500);

        const body = await res.json();

        expect(body.success).toBe(false);
        expect(body.msg).toBe(responseMsg.habit.error.INVALID_JUNCTION_IDS);
        expect(body.data).toBeNull();
    });
})