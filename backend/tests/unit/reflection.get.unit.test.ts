import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Context } from "hono";

import { ReflectionsGetController } from "../../src/controller/reflection.controller";
import { reflectionService } from "../../src/service/reflection.service";

// Mock the service layer
vi.mock("../../src/service/reflection.service", () => ({
  reflectionService: {
    listForUser: vi.fn(),
  },
}));

describe("ReflectionsGetController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createMockContext(user: any) {
    const json = vi.fn((body, status = 200) => ({
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

    const response = await ReflectionsGetController(c);

    expect(json).toHaveBeenCalledWith(
      { success: false, message: "No id detected" },
      400
    );

    expect(response).toEqual({
      status: 400,
      body: { success: false, message: "No id detected" },
    });

    expect(reflectionService.listForUser).not.toHaveBeenCalled();
  });

  it("should return reflections when service succeeds", async () => {
    const reflections = [
      { id: "1", title: "Goal 1", userId: "11111111-1111-1111-1111-111111111111" },
      { id: "2", title: "Goal 2", userId: "11111111-1111-1111-1111-111111111111" },
    ];

    vi.mocked(reflectionService.listForUser).mockResolvedValue(
      reflections as any
    );

    const { c, json } = createMockContext({
      id: "11111111-1111-1111-1111-111111111111",
    });

    const response = await ReflectionsGetController(c);

    expect(reflectionService.listForUser).toHaveBeenCalledTimes(1);
    expect(reflectionService.listForUser).toHaveBeenCalledWith(
      "11111111-1111-1111-1111-111111111111"
    );

    expect(json).toHaveBeenCalledWith({
      success: true,
      msg: "Reflection loaded",
      data: reflections,
    });

    expect(response).toEqual({
      status: 200,
      body: {
        success: true,
        msg: "Reflection loaded",
        data: reflections,
      },
    });
  });

  it("should return 500 when service throws an error", async () => {
    vi.mocked(reflectionService.listForUser).mockRejectedValue(
      new Error("Database failed")
    );

    const { c, json } = createMockContext({
      id: "11111111-1111-1111-1111-111111111111",
    });

    const response = await ReflectionsGetController(c);

    expect(reflectionService.listForUser).toHaveBeenCalledTimes(1);

    expect(json).toHaveBeenCalledWith(
      {
        success: false,
        message: "Database failed",
      },
      500
    );

    expect(response).toEqual({
      status: 500,
      body: {
        success: false,
        message: "Database failed",
      },
    });
  });

  it("should return generic 500 message for non-Error throws", async () => {
    vi.mocked(reflectionService.listForUser).mockRejectedValue("boom");

    const { c, json } = createMockContext({
      id: "11111111-1111-1111-1111-111111111111",
    });

    const response = await ReflectionsGetController(c);

    expect(json).toHaveBeenCalledWith(
      {
        success: false,
        message: "Something went wrong",
      },
      500
    );

    expect(response).toEqual({
      status: 500,
      body: {
        success: false,
        message: "Something went wrong",
      },
    });
  });
});