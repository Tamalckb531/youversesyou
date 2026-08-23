import { describe, it, expect, vi, beforeEach } from "vitest";

import { ReflectionRepository } from "../../../src/repository/reflection.repository";
import { HabitRepository } from "../../../src/repository/habit.repository";

import { HabitService } from "../../../src/service/habit.service";
import { responseMsg } from "../../../src/lib/constants";
import { INSERT_HABIT, createdHabit } from "../../../src/data/habit-test.data";
import { TEST_USER, TEST_REFLECTION, TEST_REFLECTION_IDS } from "../../../src/test-data";

vi.mock("../../../src/repository/reflection.repository", () => ({
    ReflectionRepository: {
        findReflectionsByIds: vi.fn(),
    },
}));

vi.mock("../../../src/lib/utils", async (importOriginal) => {
    const actual = await importOriginal<typeof import("../../../src/lib/utils")>();

    return {
        ...actual,
        toNewHabit: vi.fn((input) => ({
            ...input,
        })),
    };
});

vi.mock("../../../src/repository/habit.repository", () => ({
    HabitRepository: {
        createWithJunctions: vi.fn(),
    },
}));


describe("HabitService.createOne", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should create a habit when all reflection ids are valid", async () => {

        const userId = TEST_USER.id;

        const input = INSERT_HABIT;

        vi.mocked(
            ReflectionRepository.findReflectionsByIds,
        ).mockResolvedValue([
            { id: TEST_REFLECTION_IDS[0] },
            { id: TEST_REFLECTION_IDS[1] },
        ] as any);


        const repositoryResult = createdHabit;

        vi.mocked(
            HabitRepository.createWithJunctions,
        ).mockResolvedValue(repositoryResult as any);


        const result = await HabitService.createOne(
            userId,
            {
                ...input,
                junctionIdArray: [
                    TEST_REFLECTION_IDS[0],
                    TEST_REFLECTION_IDS[1],
                ],
            },
        );


        expect(
            ReflectionRepository.findReflectionsByIds,
        ).toHaveBeenCalledTimes(1);


        expect(
            ReflectionRepository.findReflectionsByIds,
        ).toHaveBeenCalledWith(
            userId,
            [
                TEST_REFLECTION_IDS[0],
                TEST_REFLECTION_IDS[1],
            ],
        );


        expect(
            HabitRepository.createWithJunctions,
        ).toHaveBeenCalledTimes(1);


        expect(
            HabitRepository.createWithJunctions,
        ).toHaveBeenCalledWith(
            userId,
            expect.objectContaining({
                junctionIdArray: [
                    TEST_REFLECTION_IDS[0],
                    TEST_REFLECTION_IDS[1],
                ],
            }),
        );


        expect(result).toEqual(repositoryResult);
    });

    it("should reject when one reflection id does not exist", async () => {

        const userId = TEST_USER.id;

        const validId = TEST_REFLECTION_IDS[0];

        const invalidId = TEST_REFLECTION_IDS[14];

        vi.mocked(
            ReflectionRepository.findReflectionsByIds,
        ).mockResolvedValue([
            { id: validId },
        ] as any);


        const input = {
            ...INSERT_HABIT,
            junctionIdArray: [
                validId,
                invalidId,
            ],
        };


        await expect(
            HabitService.createOne(userId, input),
        ).rejects.toThrow(
            responseMsg.habit.error.INVALID_JUNCTION_IDS,
        );


        expect(
            HabitRepository.createWithJunctions,
        ).not.toHaveBeenCalled();
    });

    it("should reject when all reflection ids are invalid", async () => {

        vi.mocked(
            ReflectionRepository.findReflectionsByIds,
        ).mockResolvedValue([]);


        const input = {
            ...INSERT_HABIT,
            junctionIdArray: [
                TEST_REFLECTION_IDS[10],
                TEST_REFLECTION_IDS[11],
            ],
        };


        await expect(
            HabitService.createOne(
                TEST_USER.id,
                input,
            ),
        ).rejects.toThrow(
            responseMsg.habit.error.INVALID_JUNCTION_IDS,
        );


        expect(
            HabitRepository.createWithJunctions,
        ).not.toHaveBeenCalled();
    });

    it("should deduplicate duplicate reflection ids", async () => {

        const reflectionId = TEST_REFLECTION_IDS[0];

        vi.mocked(
            ReflectionRepository.findReflectionsByIds,
        ).mockResolvedValue([
            { id: reflectionId },
        ] as any);


        vi.mocked(
            HabitRepository.createWithJunctions,
        ).mockResolvedValue(
            createdHabit as any,
        );


        const input = {
            ...INSERT_HABIT,
            junctionIdArray: [
                reflectionId,
                reflectionId,
                reflectionId,
            ],
        };


        await HabitService.createOne(
            TEST_USER.id,
            input,
        );


        expect(
            ReflectionRepository.findReflectionsByIds,
        ).toHaveBeenCalledWith(
            TEST_USER.id,
            [reflectionId],
        );


        expect(
            HabitRepository.createWithJunctions,
        ).toHaveBeenCalledWith(
            TEST_USER.id,
            expect.objectContaining({
                junctionIdArray: [reflectionId],
            }),
        );
    });

    it("should preserve multiple unique reflection ids", async () => {

        const reflectionIds = [
            TEST_REFLECTION_IDS[0],
            TEST_REFLECTION_IDS[1],
            TEST_REFLECTION_IDS[2],
            TEST_REFLECTION_IDS[3],
        ];


        vi.mocked(
            ReflectionRepository.findReflectionsByIds,
        ).mockResolvedValue(
            reflectionIds.map((id) => ({ id })) as any,
        );


        vi.mocked(
            HabitRepository.createWithJunctions,
        ).mockResolvedValue(
            createdHabit as any,
        );


        const input = {
            ...INSERT_HABIT,
            junctionIdArray: reflectionIds,
        };


        await HabitService.createOne(
            TEST_USER.id,
            input,
        );


        expect(
            HabitRepository.createWithJunctions,
        ).toHaveBeenCalledWith(
            TEST_USER.id,
            expect.objectContaining({
                junctionIdArray: reflectionIds,
            }),
        );
    });

    it("should not create habit when reflection validation fails", async () => {

        vi.mocked(
            ReflectionRepository.findReflectionsByIds,
        ).mockResolvedValue([
            {
                id: TEST_REFLECTION_IDS[0],
            },
        ] as any);


        const input = {
            ...INSERT_HABIT,
            junctionIdArray: [
                TEST_REFLECTION_IDS[0],
                TEST_REFLECTION_IDS[5],
            ],
        };


        await expect(
            HabitService.createOne(
                TEST_USER.id,
                input,
            ),
        ).rejects.toThrow(
            responseMsg.habit.error.INVALID_JUNCTION_IDS,
        );


        expect(
            HabitRepository.createWithJunctions,
        ).not.toHaveBeenCalled();
    });

    it("should pass the correct user id to reflection repository", async () => {

        vi.mocked(
            ReflectionRepository.findReflectionsByIds,
        ).mockResolvedValue([
            {
                id: TEST_REFLECTION_IDS[0],
            },
        ] as any);


        vi.mocked(
            HabitRepository.createWithJunctions,
        ).mockResolvedValue(
            createdHabit as any,
        );


        await HabitService.createOne(
            TEST_USER.id,
            {
                ...INSERT_HABIT,
                junctionIdArray: [
                    TEST_REFLECTION_IDS[0],
                ],
            },
        );


        expect(
            ReflectionRepository.findReflectionsByIds,
        ).toHaveBeenCalledWith(
            TEST_USER.id,
            [
                TEST_REFLECTION_IDS[0],
            ],
        );
    });

    it("should propagate repository errors", async () => {

        vi.mocked(
            ReflectionRepository.findReflectionsByIds,
        ).mockResolvedValue([
            {
                id: TEST_REFLECTION_IDS[0],
            },
        ] as any);


        vi.mocked(
            HabitRepository.createWithJunctions,
        ).mockRejectedValue(
            new Error("Database failed"),
        );


        await expect(
            HabitService.createOne(
                TEST_USER.id,
                {
                    ...INSERT_HABIT,
                    junctionIdArray: [
                        TEST_REFLECTION_IDS[0],
                    ],
                },
            ),
        ).rejects.toThrow("Database failed");
    });

    it("should not call habit repository when reflection repository returns incomplete results", async () => {

        const requestedIds = [
            TEST_REFLECTION_IDS[0],
            TEST_REFLECTION_IDS[1],
            TEST_REFLECTION_IDS[2],
        ];


        vi.mocked(
            ReflectionRepository.findReflectionsByIds,
        ).mockResolvedValue([
            {
                id: TEST_REFLECTION_IDS[0],
            },
            {
                id: TEST_REFLECTION_IDS[1],
            },
        ] as any);


        const input = {
            ...INSERT_HABIT,
            junctionIdArray: requestedIds,
        };


        await expect(
            HabitService.createOne(
                TEST_USER.id,
                input,
            ),
        ).rejects.toThrow(
            responseMsg.habit.error.INVALID_JUNCTION_IDS,
        );


        expect(
            HabitRepository.createWithJunctions,
        ).not.toHaveBeenCalled();
    });

    it("should allow a habit to be connected to many reflections", async () => {

        const reflectionIds = [
            TEST_REFLECTION.id,
            TEST_REFLECTION_IDS[0],
            TEST_REFLECTION_IDS[1],
            TEST_REFLECTION_IDS[2],
            TEST_REFLECTION_IDS[3],
        ];


        vi.mocked(
            ReflectionRepository.findReflectionsByIds,
        ).mockResolvedValue(
            reflectionIds.map((id) => ({ id })) as any,
        );


        vi.mocked(
            HabitRepository.createWithJunctions,
        ).mockResolvedValue(
            createdHabit as any,
        );


        await HabitService.createOne(
            TEST_USER.id,
            {
                ...INSERT_HABIT,
                junctionIdArray: reflectionIds,
            },
        );


        expect(
            HabitRepository.createWithJunctions,
        ).toHaveBeenCalledWith(
            TEST_USER.id,
            expect.objectContaining({
                junctionIdArray: reflectionIds,
            }),
        );
    });
});