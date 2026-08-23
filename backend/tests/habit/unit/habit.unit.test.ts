import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Context } from "hono";

import { responseMsg } from "../../../src/lib/constants";
import { HabitCreateController, HabitGetController } from "../../../src/controller/habit.controller";
import { HabitService } from "../../../src/service/habit.service";
import { TEST_REFLECTION_IDS, TEST_USER } from "../../../src/test-data";
import { createdHabit, INSERT_HABIT } from "../../../src/data/habit-test.data";

vi.mock("../../../src/service/habit.service", () => ({
  HabitService: {
    allHabits: vi.fn(),
    createOne: vi.fn(),
  },
}));

describe("HabitGetController", () => {
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

    const response = await HabitGetController(c);

    expect(json).toHaveBeenCalledWith(
      { success: false, msg: responseMsg.generic.error.NO_USER_ID, data:null },
      400
    );

    expect(response).toEqual({
      status: 400,
      body: { success: false, msg: responseMsg.generic.error.NO_USER_ID, data:null },
    });

    expect(HabitService.allHabits).not.toHaveBeenCalled();
  });

  it("should return generics when service succeeds", async () => {
    const habits = [
      { id: "1", title: "Habit 1", userId: TEST_USER.id },
      { id: "2", title: "Habit 2", userId: TEST_USER.id },
    ];

    //? When the controller call the service, it pretends to be successful and return the generics
    vi.mocked(HabitService.allHabits).mockResolvedValue(
      habits as any
    );

    const { c, json } = createMockContext({
      id: TEST_USER.id,
    });

    const response = await HabitGetController(c);

    expect(HabitService.allHabits).toHaveBeenCalledTimes(1);
    expect(HabitService.allHabits).toHaveBeenCalledWith(
      TEST_USER.id
    );

    expect(json).toHaveBeenCalledWith({
      success: true,
      msg: responseMsg.habit.success.GET_ALL,
      data: habits,
    });

    expect(response).toEqual({
      status: 200,
      body: {
        success: true,
        msg: responseMsg.habit.success.GET_ALL,
        data: habits,
      },
    });
  });

  it("should return 500 when service throws an error", async () => {
    vi.mocked(HabitService.allHabits).mockRejectedValue(
      new Error("Database failed")
    );

    const { c, json } = createMockContext({
      id: TEST_USER.id,
    });

    const response = await HabitGetController(c);

    expect(HabitService.allHabits).toHaveBeenCalledTimes(1);

    expect(json).toHaveBeenCalledWith(
      {
        success: false,
        msg: "Database failed",
        data:null
      },
      500
    );

    expect(response).toEqual({
      status: 500,
      body: {
        success: false,
        msg: "Database failed",
        data:null
      },
    });
  });

  it("should return generic 500 message for non-Error throws", async () => {
    vi.mocked(HabitService.allHabits).mockRejectedValue("boom");

    const { c, json } = createMockContext({
      id: TEST_USER.id,
    });

    const response = await HabitGetController(c);

    expect(json).toHaveBeenCalledWith(
      {
        success: false,
        msg: responseMsg.generic.error.GENERIC_500,
        data:null
      },
      500
    );

    expect(response).toEqual({
      status: 500,
      body: {
        success: false,
        msg: responseMsg.generic.error.GENERIC_500,
        data:null
      },
    });
  });
});

describe("HabitCreateController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function createMockContext(user: any, body: unknown) {
        const json = vi.fn();

        json.mockImplementation((responseBody, status = 200) => ({
            status,
            body: responseBody,
        }));

        const c = {
            get: vi.fn().mockReturnValue(user),
            req: {
                json: vi.fn().mockResolvedValue(body),
            },
            json,
        } as unknown as Context;

        return { c, json };
    }


    it("should return 400 when user id is missing", async () => {
        const { c, json } = createMockContext(
            {},
            INSERT_HABIT,
        );

        const response = await HabitCreateController(c);

        expect(json).toHaveBeenCalledWith(
            {
                success: false,
                msg: responseMsg.generic.error.NO_USER_ID,
                data: null,
            },
            400,
        );

        expect(response.status).toBe(400);

        expect(HabitService.createOne).not.toHaveBeenCalled();
    });


    it("should return 400 when request body is invalid", async () => {
        const invalidBody = {
            title: "Invalid Habit",
            junctionIdArray: "not-an-array",
        };

        const { c, json } = createMockContext(
            { id: TEST_USER.id },
            invalidBody,
        );

        const response = await HabitCreateController(c);

        expect(json).toHaveBeenCalled();

        expect(response).toEqual(
            expect.objectContaining({
                status: 400,
                body: expect.objectContaining({
                    success: false,
                    data: null,
                }),
            }),
        );

        expect(HabitService.createOne).not.toHaveBeenCalled();
    });


    it("should return 400 when request body is empty", async () => {
        const { c, json } = createMockContext(
            { id: TEST_USER.id },
            {},
        );

        const response = await HabitCreateController(c);

        expect(json).toHaveBeenCalled();

        expect(response.status).toBe(400);

        expect(HabitService.createOne).not.toHaveBeenCalled();
    });


    it("should return 400 when junctionIdArray contains invalid values", async () => {
        const invalidBody = {
            name: "Morning Exercise",
            description: "Exercise every morning",
            color: "#FF5733",
            isArchived: false,
            junctionIdArray: [
                "not-a-uuid",
            ],
        };

        const { c, json } = createMockContext(
            { id: TEST_USER.id },
            invalidBody,
        );

        const response = await HabitCreateController(c);

        expect(json).toHaveBeenCalled();

        expect(response.status).toBe(400);

        expect(HabitService.createOne).not.toHaveBeenCalled();
    });


    it("should create habit when service succeeds", async () => {
        vi.mocked(HabitService.createOne).mockResolvedValue(
            createdHabit as any,
        );

        const body = INSERT_HABIT;

        const { c, json } = createMockContext(
            { id: TEST_USER.id },
            body,
        );

        const response = await HabitCreateController(c);

        expect(HabitService.createOne).toHaveBeenCalledTimes(1);

        expect(HabitService.createOne).toHaveBeenCalledWith(
            TEST_USER.id,
            body,
        );

        expect(json).toHaveBeenCalledWith(
            {
                success: true,
                msg: responseMsg.habit.success.CREATED_BULK,
                data: createdHabit,
            },
            201,
        );

        expect(response.status).toBe(201);
    });


    it("should return 500 when service throws an Error", async () => {
        vi.mocked(HabitService.createOne).mockRejectedValue(
            new Error("Database failed"),
        );

        const { c, json } = createMockContext(
            { id: TEST_USER.id },
            INSERT_HABIT,
        );

        const response = await HabitCreateController(c);

        expect(json).toHaveBeenCalledWith(
            {
                success: false,
                msg: "Database failed",
                data: null,
            },
            500,
        );

        expect(response.status).toBe(500);
    });


    it("should return generic 500 message for non-Error throws", async () => {
        vi.mocked(HabitService.createOne).mockRejectedValue(
            "boom",
        );

        const { c, json } = createMockContext(
            { id: TEST_USER.id },
            INSERT_HABIT,
        );

        const response = await HabitCreateController(c);

        expect(json).toHaveBeenCalledWith(
            {
                success: false,
                msg: responseMsg.generic.error.GENERIC_500,
                data: null,
            },
            500,
        );

        expect(response.status).toBe(500);
    });


    it("should pass multiple reflection ids to service", async () => {
        vi.mocked(HabitService.createOne).mockResolvedValue(
            createdHabit as any,
        );

        const body = {
            ...INSERT_HABIT,
            junctionIdArray: [
                TEST_REFLECTION_IDS[0],
                TEST_REFLECTION_IDS[1],
                TEST_REFLECTION_IDS[2],
            ],
        };

        const { c } = createMockContext(
            { id: TEST_USER.id },
            body,
        );

        await HabitCreateController(c);

        expect(HabitService.createOne).toHaveBeenCalledWith(
            TEST_USER.id,
            body,
        );
    });
});