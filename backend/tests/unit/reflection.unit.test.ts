import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Context } from "hono";

import { ReflectionsGetController, ReflectionsGetOneController } from "../../src/controller/reflection.controller";
import { reflectionService } from "../../src/service/reflection.service";
import { TEST_USER } from "../../src/test-data";
import { responseMsg } from "../../src/lib/constants";

// Mock the service layer
vi.mock("../../src/service/reflection.service", () => ({
  reflectionService: {
    listForUser: vi.fn(),
    oneForUser: vi.fn(),
  },
}));

describe("ReflectionsGetController", () => {
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

    const response = await ReflectionsGetController(c);

    expect(json).toHaveBeenCalledWith(
      { success: false, msg: responseMsg.reflection.error.NO_USER_ID, data:null },
      400
    );

    expect(response).toEqual({
      status: 400,
      body: { success: false, msg: responseMsg.reflection.error.NO_USER_ID, data:null },
    });

    expect(reflectionService.listForUser).not.toHaveBeenCalled();
  });

  it("should return reflections when service succeeds", async () => {
    const reflections = [
      { id: "1", title: "Goal 1", userId: TEST_USER.id },
      { id: "2", title: "Goal 2", userId: TEST_USER.id },
    ];

    //? When the controller call the service, it pretends to be successful and return the reflections
    vi.mocked(reflectionService.listForUser).mockResolvedValue(
      reflections as any
    );

    const { c, json } = createMockContext({
      id: TEST_USER.id,
    });

    const response = await ReflectionsGetController(c);

    expect(reflectionService.listForUser).toHaveBeenCalledTimes(1);
    expect(reflectionService.listForUser).toHaveBeenCalledWith(
      TEST_USER.id
    );

    expect(json).toHaveBeenCalledWith({
      success: true,
      msg: responseMsg.reflection.success.GET_ALL,
      data: reflections,
    });

    expect(response).toEqual({
      status: 200,
      body: {
        success: true,
        msg: responseMsg.reflection.success.GET_ALL,
        data: reflections,
      },
    });
  });

  it("should return 500 when service throws an error", async () => {
    vi.mocked(reflectionService.listForUser).mockRejectedValue(
      new Error("Database failed")
    );

    const { c, json } = createMockContext({
      id: TEST_USER.id,
    });

    const response = await ReflectionsGetController(c);

    expect(reflectionService.listForUser).toHaveBeenCalledTimes(1);

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
    vi.mocked(reflectionService.listForUser).mockRejectedValue("boom");

    const { c, json } = createMockContext({
      id: TEST_USER.id,
    });

    const response = await ReflectionsGetController(c);

    expect(json).toHaveBeenCalledWith(
      {
        success: false,
        msg: responseMsg.reflection.error.GENERIC_500,
        data:null
      },
      500
    );

    expect(response).toEqual({
      status: 500,
      body: {
        success: false,
        msg: responseMsg.reflection.error.GENERIC_500,
        data:null
      },
    });
  });
});

// describe("ReflectionsGetOneController", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   function createMockContext(user: any, reflectionId?:string) {
//     const json = vi.fn();
//     json.mockImplementation((body, status = 200) => ({
//       status,
//       body,
//     }));

//     const c = {
//       req: { param: vi.fn().mockReturnValue(reflectionId), },
//       get: vi.fn().mockReturnValue(user),
//       json,
//     } as unknown as Context;

//     return { c, json };
//   }

//   it("should return 400 when reflection id is missing", async () => {
//     const { c, json } = createMockContext(
//       { id: TEST_USER.id },
//       undefined
//     );

//     const response = await ReflectionsGetOneController(c);

//     expect(json).toHaveBeenCalledWith(
//       { success: false, message: "No reflection detected" },
//       400
//     );

//     expect(response).toEqual({
//       status: 400,
//       body: { success: false, message: "No id detected" },
//     });

//     expect(reflectionService.listForUser).not.toHaveBeenCalled();
//   });

// })