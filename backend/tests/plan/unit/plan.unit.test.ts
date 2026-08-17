import type { Context } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PlanGetController, PlanGetOneController } from "../../../src/controller/plan.controller";
import { responseMsg } from "../../../src/lib/constants";
import { PlanService } from "../../../src/service/plan.service";
import { TEST_PLAN_IDS } from "../../../src/data/plan-test-data";
import { TEST_MIDDLEWARE_USER, TEST_REFLECTION_IDS, TEST_USER } from "../../../src/test-data";

vi.mock("../../../src/service/plan.service", () => ({
    PlanService: {
        allPlans: vi.fn(),
        onePlan: vi.fn(),
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

describe("PlanGetOneController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createMockContext = (
        planId?: string,
        user?: any,
    ) => {
        const json = vi.fn();

        const c = {
            req: {
                param: vi.fn().mockReturnValue(planId),
            },
            get: vi.fn().mockReturnValue(user),
            json,
        } as unknown as Context;

        return {
            c,
            json,
        };
    };

    it("should return 400 when plan id is missing", async () => {
        const { c, json } = createMockContext(
            undefined,
            TEST_MIDDLEWARE_USER,
        );

        await PlanGetOneController(c);

        expect(json).toHaveBeenCalledWith(
            {
                success: false,
                msg: responseMsg.plan.error.NO_PLAN_ID,
                data: null,
            },
            400,
        );

        expect(PlanService.onePlan).not.toHaveBeenCalled();
    });

    it("should return 400 when user id is missing", async () => {
        const userWithoutId = {
            ...TEST_MIDDLEWARE_USER,
            id: undefined,
        };

        const { c, json } = createMockContext(
            TEST_PLAN_IDS[0],
            userWithoutId,
        );

        await PlanGetOneController(c);

        expect(json).toHaveBeenCalledWith(
            {
                success: false,
                msg: responseMsg.generic.error.NO_USER_ID,
                data: null,
            },
            400,
        );

        expect(PlanService.onePlan).not.toHaveBeenCalled();
    });

    it("should return an overall plan with related reflections", async () => {
        const planId = TEST_PLAN_IDS[0];

        const item = {
            plan: {
                id: planId,
                userId: TEST_USER.id,
                title: "Overall Plan 1",
                description: "Test overall plan 1",
                type: "overall",
                time: null,
                status: "active",
            },
            relatedConnections: [
                {
                    id: TEST_REFLECTION_IDS[0],
                    userId: TEST_USER.id,
                    type: "goal",
                    title: "Goal 1",
                    status: "active",
                },
                {
                    id: TEST_REFLECTION_IDS[1],
                    userId: TEST_USER.id,
                    type: "goal",
                    title: "Goal 2",
                    status: "active",
                },
            ],
        };

        vi.mocked(PlanService.onePlan).mockResolvedValue(item as any);

        const { c, json } = createMockContext(
            planId,
            TEST_MIDDLEWARE_USER,
        );

        await PlanGetOneController(c);

        expect(PlanService.onePlan).toHaveBeenCalledTimes(1);

        expect(PlanService.onePlan).toHaveBeenCalledWith(
            planId,
            TEST_USER.id,
        );

        expect(json).toHaveBeenCalledWith({
            success: true,
            msg: responseMsg.plan.success.GET_ONE,
            data: item,
        });
    });

    it("should return a non-overall plan with related parent plans", async () => {
        const planId = TEST_PLAN_IDS[4];

        const item = {
            plan: {
                id: planId,
                userId: TEST_USER.id,
                title: "Monthly Plan 1",
                description: "Test monthly plan 1",
                type: "monthly",
                time: "Jan",
                status: "active",
            },
            relatedConnections: [
                {
                    id: TEST_PLAN_IDS[2],
                    userId: TEST_USER.id,
                    title: "Yearly Plan 1",
                    type: "yearly",
                    time: "2026",
                    status: "active",
                },
                {
                    id: TEST_PLAN_IDS[3],
                    userId: TEST_USER.id,
                    title: "Yearly Plan 2",
                    type: "yearly",
                    time: "2027",
                    status: "active",
                },
            ],
        };

        vi.mocked(PlanService.onePlan).mockResolvedValue(item as any);

        const { c, json } = createMockContext(
            planId,
            TEST_MIDDLEWARE_USER,
        );

        await PlanGetOneController(c);

        expect(PlanService.onePlan).toHaveBeenCalledTimes(1);

        expect(PlanService.onePlan).toHaveBeenCalledWith(
            planId,
            TEST_USER.id,
        );

        expect(json).toHaveBeenCalledWith({
            success: true,
            msg: responseMsg.plan.success.GET_ONE,
            data: item,
        });
    });

    it("should return 500 when service throws an Error", async () => {
        const errorMessage = "Plan not found";

        vi.mocked(PlanService.onePlan).mockRejectedValue(
            new Error(errorMessage),
        );

        const { c, json } = createMockContext(
            TEST_PLAN_IDS[0],
            TEST_MIDDLEWARE_USER,
        );

        await PlanGetOneController(c);

        expect(PlanService.onePlan).toHaveBeenCalledWith(
            TEST_PLAN_IDS[0],
            TEST_USER.id,
        );

        expect(json).toHaveBeenCalledWith(
            {
                success: false,
                msg: errorMessage,
                data: null,
            },
            500,
        );
    });

    it("should return generic 500 when service throws a non-Error value", async () => {
        vi.mocked(PlanService.onePlan).mockRejectedValue(
            "something went wrong",
        );

        const { c, json } = createMockContext(
            TEST_PLAN_IDS[0],
            TEST_MIDDLEWARE_USER,
        );

        await PlanGetOneController(c);

        expect(json).toHaveBeenCalledWith(
            {
                success: false,
                msg: responseMsg.generic.error.GENERIC_500,
                data: null,
            },
            500,
        );
    });
});