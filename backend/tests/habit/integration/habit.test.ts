import { describe, expect, it } from "vitest";
import { app } from "../../../src";
import { responseMsg } from "../../../src/lib/constants";
import { TEST_USER } from "../../../src/test-data";
import { INSERT_HABIT, TEST_HABIT_IDS, TEST_HABIT_LOG, UPDATE_HABIT_BODY } from "../../../src/data/habit-test.data";
import { getDb } from "../../../src/db";
import { habits } from "../../../src/db/schema";
import { eq } from "drizzle-orm";

const rootRoute = "habits"

describe(`GET /api/v1/${rootRoute}/`, () => {
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

describe(`POST /api/v1/${rootRoute}/`, () => {
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
});

describe(`PATCH /api/v1/${rootRoute}/:id`, () => {
    it("should update a habit name and isArchived", async () => {
        const habitId = TEST_HABIT_IDS[0];

        const res = await app.request(`/api/v1/${rootRoute}/${habitId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(UPDATE_HABIT_BODY),
        });

        expect(res.status).toBe(201);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.habit.success.UPDATE_ONE);
        expect(body.data.name).toBe(UPDATE_HABIT_BODY.name);
        expect(body.data.isArchived).toBe(UPDATE_HABIT_BODY.isArchived);

        const [updatedPlan] = await getDb()
            .select({
                id: habits.id,
                name: habits.name,
                isArchived: habits.isArchived,
                userId: habits.userId,
            })
            .from(habits)
            .where(eq(habits.id, habitId));

        expect(updatedPlan.id).toBe(habitId);
        expect(updatedPlan.name).toBe(UPDATE_HABIT_BODY.name);
        expect(updatedPlan.isArchived).toBe(UPDATE_HABIT_BODY.isArchived);
        expect(updatedPlan.userId).toBe(TEST_USER.id);
    });

    it("should return error when habit id is invalid", async () => {
        const invalidHabitId = "aaaaaaaa-1111-4111-8111-111111111111";

        const res = await app.request(`/api/v1/${rootRoute}/${invalidHabitId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(UPDATE_HABIT_BODY),
        });

        expect(res.status).toBe(500);

        const body = await res.json();

        expect(body.success).toBe(false);
        expect(body.msg).toBe(responseMsg.habit.error.NO_HABIT_ID);
        expect(body.data).toBeNull();
    });

    it("should return error when request body is invalid", async () => {
        const res = await app.request(`/api/v1/${rootRoute}/${TEST_HABIT_IDS[0]}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: "", isArchived:"yes" }),
        });

        expect(res.status).toBe(400);

        const body = await res.json();

        expect(body.success).toBe(false);
        expect(body.data).toBeNull();
    });
});

describe(`DELETE /api/v1/${rootRoute}/:id`, () => {
    it("should delete a habit", async () => {
        const habitId = TEST_HABIT_IDS[0];

        const res = await app.request(`/api/v1/${rootRoute}/${habitId}`, {
            method: "DELETE",
        });

        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.habit.success.DELETED);
        expect(body.data).toBe(habitId);
    });

    it("should return error when habit id is invalid", async () => {
        const invalidHabitId = "aaaaaaaa-1111-4111-8111-111111111111";

        const res = await app.request(`/api/v1/${rootRoute}/${invalidHabitId}`, {
            method: "DELETE",
        });

        expect(res.status).toBe(500);

        const body = await res.json();

        expect(body.success).toBe(false);
        expect(body.msg).toBe(responseMsg.habit.error.NO_HABIT_ID);
        expect(body.data).toBeNull();
    });
});

describe(`POST /api/v1/${rootRoute}/:id/mark`, () => {
    it("should create a habit log", async () => {
        const habitId = TEST_HABIT_IDS[1];

        const res = await app.request(`/api/v1/${rootRoute}/${habitId}/mark`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(TEST_HABIT_LOG),
        });

        expect(res.status).toBe(201);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.habit.success.MARKED);
    });

    it("should delete the same habit log", async () => {
        const habitId = TEST_HABIT_IDS[1];

        const res = await app.request(`/api/v1/${rootRoute}/${habitId}/mark`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(TEST_HABIT_LOG),
        });

        expect(res.status).toBe(201);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.habit.success.UNMARKED);
    });

    it("should return error when habit id is invalid", async () => {
        const invalidHabitId = "aaaaaaaa-1111-4111-8111-111111111111";

        const res = await app.request(`/api/v1/${rootRoute}/${invalidHabitId}/mark`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(TEST_HABIT_LOG),
        });

        expect(res.status).toBe(500);

        const body = await res.json();

        expect(body.success).toBe(false);
        expect(body.msg).toBe(responseMsg.habit.error.NO_HABIT_ID);
    });
});

describe(`GET /api/v1/${rootRoute}/:id`, () => {
    it("should return all habits of the test users", async () => {
        const habitId = TEST_HABIT_IDS[1];
        const res = await app.request(`/api/v1/${rootRoute}/${habitId}`, {
            method: "GET",
        })
        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.habit.success.GET_ONE);
        expect(body.data.currentStreak).toBe(8);
        expect(body.data.longestStreak).toBe(8);

        expect(body.data.userId).toBe(TEST_USER.id);
    });
});