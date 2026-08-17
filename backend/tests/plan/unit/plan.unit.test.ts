import type { Context } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PlanGetController } from "../../../src/controller/plan.controller";
import { responseMsg } from "../../../src/lib/constants";
import { PlanService } from "../../../src/service/plan.service";
import { TEST_PLAN_IDS } from "../../../src/data/plan-test-data";
import { TEST_USER } from "../../../src/test-data";

vi.mock("../../../src/service/plan.service", () => ({
    PlanService: {
        allPlans: vi.fn(),
    },
}));

describe("PlanGetController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function createMockContext(user: any) {
        const json = vi.fn();

        json.mockImplementation((body, status = 200) => ({
            status,
            body,
        }));

        const c = {
            get: vi.fn().mockReturnValue(user),
            json,
        } as unknown as Context;

        return { c, json };
    }

    it("should return 400 when user id is missing", async () => {
        const { c, json } = createMockContext({});

        const response = await PlanGetController(c);

        expect(json).toHaveBeenCalledWith(
            {
                success: false,
                msg: responseMsg.generic.error.NO_USER_ID,
                data: null,
            },
            400
        );

        expect(response).toEqual({
            status: 400,
            body: {
                success: false,
                msg: responseMsg.generic.error.NO_USER_ID,
                data: null,
            },
        });

        expect(PlanService.allPlans).not.toHaveBeenCalled();
    });

    it("should return plans when service succeeds", async () => {
        const plans = [
            {
                id: TEST_PLAN_IDS[0],
                title: "Overall Plan 1",
                userId: TEST_USER.id,
                type: "overall",
            },
            {
                id: TEST_PLAN_IDS[1],
                title: "Overall Plan 2",
                userId: TEST_USER.id,
                type: "overall",
            },
        ];

        vi.mocked(PlanService.allPlans).mockResolvedValue(
            plans as any
        );

        const { c, json } = createMockContext({
            id: TEST_USER.id,
        });

        const response = await PlanGetController(c);

        expect(PlanService.allPlans).toHaveBeenCalledTimes(1);

        expect(PlanService.allPlans).toHaveBeenCalledWith(
            TEST_USER.id
        );

        expect(json).toHaveBeenCalledWith({
            success: true,
            msg: responseMsg.plan.success.GET_ALL,
            data: plans,
        });

        expect(response).toEqual({
            status: 200,
            body: {
                success: true,
                msg: responseMsg.plan.success.GET_ALL,
                data: plans,
            },
        });
    });

    it("should return 500 when service throws an error", async () => {
        vi.mocked(PlanService.allPlans).mockRejectedValue(
            new Error("Database failed")
        );

        const { c, json } = createMockContext({
            id: TEST_USER.id,
        });

        const response = await PlanGetController(c);

        expect(PlanService.allPlans).toHaveBeenCalledTimes(1);

        expect(json).toHaveBeenCalledWith(
            {
                success: false,
                msg: "Database failed",
                data: null,
            },
            500
        );

        expect(response).toEqual({
            status: 500,
            body: {
                success: false,
                msg: "Database failed",
                data: null,
            },
        });
    });

    it("should return generic 500 message for non-Error throws", async () => {
        vi.mocked(PlanService.allPlans).mockRejectedValue("boom");

        const { c, json } = createMockContext({
            id: TEST_USER.id,
        });

        const response = await PlanGetController(c);

        expect(PlanService.allPlans).toHaveBeenCalledTimes(1);

        expect(json).toHaveBeenCalledWith(
            {
                success: false,
                msg: responseMsg.generic.error.GENERIC_500,
                data: null,
            },
            500
        );

        expect(response).toEqual({
            status: 500,
            body: {
                success: false,
                msg: responseMsg.generic.error.GENERIC_500,
                data: null,
            },
        });
    });
});