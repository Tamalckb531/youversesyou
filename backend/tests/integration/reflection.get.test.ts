import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../../src/index";
import { seed, TEST_USER } from "../../src/seed";

describe("GET /api/v1/reflections", () => {
    beforeAll(async () => {
        await seed();
    });

    it("should return all reflections of the test users", async () => {
        const res = await app.request("/api/v1/reflections/", {
            method: "GET",
        })
        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe("Reflection loaded");

        expect(body.data).toHaveLength(15);

        expect(body.data.every((r: any) => r.userId === TEST_USER.id)).toBe(true);

    });

})