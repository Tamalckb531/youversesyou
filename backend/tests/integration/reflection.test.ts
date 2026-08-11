import { describe, it, expect } from "vitest";
import { app } from "../../src/index";
import { TEST_REFLECTION, TEST_USER } from "../../src/test-data";

describe("GET /api/v1/reflections", () => {
    it("should return all reflections of the test users", async () => {
        const res = await app.request("/api/v1/reflections/", {
            method: "GET",
        })
        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe("Reflection loaded");

        console.log("All data : ", body.data);
        expect(body.data.every((r: any) => r.userId === TEST_USER.id)).toBe(true);
    });

    it("should return one reflections of the test users", async () => {
        const res = await app.request(`/api/v1/reflections/${TEST_REFLECTION.id}`, {
            method: "GET",
        })
        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe("Single reflection loaded");

        console.log("One data : ", body.data);
        expect(body.data.userId === TEST_USER.id).toBe(true);
    });
})