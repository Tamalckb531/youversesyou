import { describe, it, expect } from "vitest";
import { app } from "../../src/index";
import { INSERT_REFLECTION_ARRAY, TEST_REFLECTION, TEST_USER } from "../../src/test-data";
import { responseMsg } from "../../src/lib/constants";

describe("GET /api/v1/reflections", () => {
    it("should return all reflections of the test users", async () => {
        const res = await app.request("/api/v1/reflections/", {
            method: "GET",
        })
        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.reflection.success.GET_ALL);

        expect(body.data.every((r: any) => r.userId === TEST_USER.id)).toBe(true);
    });

    it("should return one reflections of the test users", async () => {
        const res = await app.request(`/api/v1/reflections/${TEST_REFLECTION.id}`, {
            method: "GET",
        })
        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.reflection.success.GET_ONE);

        expect(body.data.userId === TEST_USER.id).toBe(true);
    });
    it("should create multiple reflections for the test user", async () => {
        const res = await app.request("/api/v1/reflections/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(INSERT_REFLECTION_ARRAY),
        });

        expect(res.status).toBe(201);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.data).toHaveLength(3);

        for (const reflection of body.data) {
            expect(reflection.id).toBeDefined();
            expect(reflection.userId).toBe(TEST_USER.id);
            expect(reflection.status).toBe("active");
            expect(reflection.createdAt).toBeDefined();
            expect(reflection.updatedAt).toBeDefined();
        }

        expect(body.data[0].type).toBe("goal");
        expect(body.data[1].type).toBe("pain_point");
        expect(body.data[2].type).toBe("dream");
    });
})