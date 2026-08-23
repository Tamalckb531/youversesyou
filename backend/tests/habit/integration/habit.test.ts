import { describe, expect, it } from "vitest";
import { app } from "../../../src";
import { responseMsg } from "../../../src/lib/constants";
import { TEST_USER } from "../../../src/test-data";

describe("GET /api/v1/habits/", () => {
    it("should return all habits of the test users", async () => {
        const res = await app.request("/api/v1/habits/", {
            method: "GET",
        })
        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body.success).toBe(true);
        expect(body.msg).toBe(responseMsg.habit.success.GET_ALL);

        expect(body.data.every((r: any) => r.userId === TEST_USER.id)).toBe(true);
    });
})