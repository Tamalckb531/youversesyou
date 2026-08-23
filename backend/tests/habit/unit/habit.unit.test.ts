import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Context } from "hono";

import { responseMsg } from "../../../src/lib/constants";
import { HabitGetController } from "../../../src/controller/habit.controller";
import { HabitService } from "../../../src/service/habit.service";
import { TEST_USER } from "../../../src/test-data";

vi.mock("../../../src/service/habit.service", () => ({
  habitService: {
    listForUser: vi.fn(),
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

    expect(HabitService.listForUser).not.toHaveBeenCalled();
  });

  it("should return generics when service succeeds", async () => {
    const habits = [
      { id: "1", title: "Habit 1", userId: TEST_USER.id },
      { id: "2", title: "Habit 2", userId: TEST_USER.id },
    ];

    //? When the controller call the service, it pretends to be successful and return the generics
    vi.mocked(HabitService.listForUser).mockResolvedValue(
      habits as any
    );

    const { c, json } = createMockContext({
      id: TEST_USER.id,
    });

    const response = await HabitGetController(c);

    expect(HabitService.listForUser).toHaveBeenCalledTimes(1);
    expect(HabitService.listForUser).toHaveBeenCalledWith(
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
    vi.mocked(HabitService.listForUser).mockRejectedValue(
      new Error("Database failed")
    );

    const { c, json } = createMockContext({
      id: TEST_USER.id,
    });

    const response = await HabitGetController(c);

    expect(HabitService.listForUser).toHaveBeenCalledTimes(1);

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
    vi.mocked(HabitService.listForUser).mockRejectedValue("boom");

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