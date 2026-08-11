import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Context } from "hono";

import { ReflectionsGetController, ReflectionsGetOneController, ReflectionsPostController } from "../../src/controller/reflection.controller";
import { reflectionService } from "../../src/service/reflection.service";
import { createdReflections, INSERT_REFLECTION_ARRAY, TEST_REFLECTION, TEST_USER } from "../../src/test-data";
import { responseMsg } from "../../src/lib/constants";

// Mock the service layer
vi.mock("../../src/service/reflection.service", () => ({
  reflectionService: {
    listForUser: vi.fn(),
    oneForUser: vi.fn(),
    bulkCreate: vi.fn(),
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

describe("ReflectionsGetOneController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createMockContext(user: any, reflectionId?:string) {
    const json = vi.fn();
    json.mockImplementation((body, status = 200) => ({
      status,
      body,
    }));

    const c = {
      req: { param: vi.fn().mockReturnValue(reflectionId), },
      get: vi.fn().mockReturnValue(user),
      json,
    } as unknown as Context;

    return { c, json };
  }

  it("should return 400 when reflection id is missing", async () => {
    const { c, json } = createMockContext(
      { id: TEST_USER.id },
      undefined
    );

    const response = await ReflectionsGetOneController(c);

    expect(json).toHaveBeenCalledWith(
      { success: false, msg:responseMsg.reflection.error.NO_REFLECTION_ID, data:null },
      400
    );

    expect(response).toEqual({
      status: 400,
      body: { success: false, msg:responseMsg.reflection.error.NO_REFLECTION_ID, data:null },
    });

    expect(reflectionService.oneForUser).not.toHaveBeenCalled();
  });

  it("should return 400 when user id is missing", async () => {
    const { c, json } = createMockContext(
      {},
      TEST_REFLECTION.id
    );

    const response = await ReflectionsGetOneController(c);

    expect(json).toHaveBeenCalledWith(
      { success: false, msg:responseMsg.reflection.error.NO_USER_ID, data:null },
      400
    );

    expect(response).toEqual({
      status: 400,
      body: { success: false, msg:responseMsg.reflection.error.NO_USER_ID, data:null },
    });

    expect(reflectionService.oneForUser).not.toHaveBeenCalled();
  });

  it("should return one reflection when service succeeds", async () => {
   
    vi.mocked(reflectionService.oneForUser).mockResolvedValue(TEST_REFLECTION as any);
    
    const { c, json } = createMockContext(
      {id:TEST_USER.id},
      TEST_REFLECTION.id
    );

    const response = await ReflectionsGetOneController(c);

    expect(reflectionService.oneForUser).toHaveBeenCalledTimes(1);
    expect(reflectionService.oneForUser).toHaveBeenCalledWith(TEST_REFLECTION.id, TEST_USER.id);

    expect(json).toHaveBeenCalledWith(
      {
        success: true,
        msg: responseMsg.reflection.success.GET_ONE,
        data: TEST_REFLECTION
      }
    );

    expect(response).toEqual({
      status: 200,
      body: {
        success: true,
        msg: responseMsg.reflection.success.GET_ONE,
        data: TEST_REFLECTION
      }
    });
  });

  it("should return 500 when service throws an error", async () => {
   
    vi.mocked(reflectionService.oneForUser).mockRejectedValue( new Error("Database failed") );

    const { c, json } = createMockContext(
      { id: TEST_USER.id, },
      TEST_REFLECTION.id
    );

    const response = await ReflectionsGetOneController(c);

    expect(reflectionService.oneForUser).toHaveBeenCalledTimes(1);

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
    vi.mocked(reflectionService.oneForUser).mockRejectedValue("boom");

    const { c, json } = createMockContext(
      { id: TEST_USER.id, },
      TEST_REFLECTION.id
    );

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

})

describe("ReflectionsPostController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createMockContext(
    user: any,
    body: unknown
  ) {
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

      return {
          c,
          json,
      };
  }

  it("should return 400 when user id is missing", async () => {
    const { c, json } = createMockContext(
      {},
      INSERT_REFLECTION_ARRAY
    );

    const response = await ReflectionsPostController(c);

    expect(json).toHaveBeenCalledWith(
      {
        success: false,
        msg: responseMsg.reflection.error.NO_USER_ID,
        data: null,
      },
      400
    );

    expect(response).toEqual({
      status: 400,
      body: {
        success: false,
        msg: responseMsg.reflection.error.NO_USER_ID,
        data: null,
      },
    });

    expect(reflectionService.bulkCreate).not.toHaveBeenCalled();
  });

  it("should return 400 when request body is invalid", async () => {
    const invalidBody = [
      {
        type: "invalid_type",
        title: "Invalid Reflection",
        slotIndex: 1,
      },
    ];

    const { c, json } = createMockContext(
      {
        id: TEST_USER.id,
      },
      invalidBody
    );

    const response = await ReflectionsPostController(c);

    expect(json).toHaveBeenCalled();

    //! zod error differs so we can't really add msg here
    expect(response).toEqual(
      expect.objectContaining({
        status: 400,
        body: expect.objectContaining({
          success: false,
          data: null,
        }),
      })
    );

    expect(reflectionService.bulkCreate).not.toHaveBeenCalled();
  });

  it("should return 400 when request body is valid but not an array", async () => {
    const nonArrayBody = INSERT_REFLECTION_ARRAY[0];

    const { c, json } = createMockContext(
      {
        id: TEST_USER.id,
      },
      nonArrayBody
    );

    const response = await ReflectionsPostController(c);

    expect(json).toHaveBeenCalled();

    expect(response).toEqual(
      expect.objectContaining({
        status: 400,
        body: expect.objectContaining({
          success: false,
          data: null,
        }),
      })
    );

    expect(reflectionService.bulkCreate).not.toHaveBeenCalled();
  });

  it("should create reflections when service succeeds", async () => {

    vi.mocked(reflectionService.bulkCreate).mockResolvedValue(
      createdReflections as any
    );

    const { c, json } = createMockContext(
      {
        id: TEST_USER.id,
      },
      INSERT_REFLECTION_ARRAY
    );

    const response = await ReflectionsPostController(c);

    expect(
      reflectionService.bulkCreate
    ).toHaveBeenCalledTimes(1);

    expect(
      reflectionService.bulkCreate
    ).toHaveBeenCalledWith(
      TEST_USER.id,
      INSERT_REFLECTION_ARRAY
    );

    expect(json).toHaveBeenCalledWith(
      {
        success: true,
        msg: responseMsg.reflection.success.CREATED_BULK,
        data: createdReflections,
      },
      201
    );

    expect(response).toEqual({
      status: 201,
      body: {
        success: true,
        msg: responseMsg.reflection.success.CREATED_BULK,
        data: createdReflections,
      },
    });
  });

  it("should return 500 when service throws an Error", async () => {
    vi.mocked(reflectionService.bulkCreate).mockRejectedValue(
      new Error("Database failed")
    );

    const { c, json } = createMockContext(
      {
        id: TEST_USER.id,
      },
      INSERT_REFLECTION_ARRAY
    );

    const response = await ReflectionsPostController(c);

    expect(
      reflectionService.bulkCreate
    ).toHaveBeenCalledTimes(1);

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
    vi.mocked(reflectionService.bulkCreate).mockRejectedValue(
      "boom"
    );

    const { c, json } = createMockContext(
      {
        id: TEST_USER.id,
      },
      INSERT_REFLECTION_ARRAY
    );

    const response = await ReflectionsPostController(c);

    expect(json).toHaveBeenCalledWith(
      {
        success: false,
        msg: responseMsg.reflection.error.GENERIC_500,
        data: null,
      },
      500
    );

    expect(response).toEqual({
      status: 500,
      body: {
        success: false,
        msg: responseMsg.reflection.error.GENERIC_500,
        data: null,
      },
    });
  });
});