import { describe, it, expect, vi, beforeEach } from "vitest";
import { reflectionService } from "../../src/service/reflection.service";
import { TEST_REFLECTION, TEST_USER } from "../../src/test-data";
import { responseMsg } from "../../src/lib/constants";
import { ReflectionRepository } from "../../src/repository/reflection.repository";
import { toUpdateRow } from "../../src/lib/utils";

vi.mock("../../src/repository/reflection.repository", () => ({
    ReflectionRepository: {
        findOneByUserId: vi.fn(),
        updateOne: vi.fn(),
    },
}));

vi.mock("../../src/lib/utils", () => ({
    toUpdateRow: vi.fn((input) => ({
        ...input,
        updatedAt: new Date(),
    })),
    DAYS_120: 120,
    MS_PER_DAY: 24 * 60 * 60 * 1000
}));

toUpdateRow

describe("ReflectionsPatchController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should update the reflection when it is older than 120 days", async () => {
        const reflectionId = TEST_REFLECTION.id;
        const userId = TEST_USER.id;

        const oldUpdatedAt = new Date(
            Date.now() - 121 * 24 * 60 * 60 * 1000
        );

        vi.mocked(
            ReflectionRepository.findOneByUserId
        ).mockResolvedValue({
            id: reflectionId,
            userId,
            updatedAt: oldUpdatedAt,
        } as any);

        const repositoryResult = {
            rowCount: 1,
        };

        vi.mocked(
            ReflectionRepository.updateOne
        ).mockResolvedValue(repositoryResult as any);

        const result = await reflectionService.updateOne(
            userId,
            reflectionId,
            {
                title: "Updated title",
            }
        );

        expect(
            ReflectionRepository.findOneByUserId
        ).toHaveBeenCalledTimes(1);

        expect(
            ReflectionRepository.findOneByUserId
        ).toHaveBeenCalledWith(
            reflectionId,
            userId
        );

        //! The 120-day rule passed,
        expect(
            ReflectionRepository.updateOne
        ).toHaveBeenCalledTimes(1);

        expect(
            ReflectionRepository.updateOne
        ).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Updated title",
            }),
            reflectionId,
            userId
        );

        expect(result.success).toBe(true);
        expect(result.msg).toBe(responseMsg.reflection.success.UPDATE_ONE);
        expect(result.data).toEqual(repositoryResult);
    });

    it("should not update the reflection when it is younger than 120 days", async () => {
        const reflectionId = TEST_REFLECTION.id;
        const userId = TEST_USER.id;

        const recentUpdatedAt = new Date(
            Date.now() - 119 * 24 * 60 * 60 * 1000
        );

        vi.mocked(
            ReflectionRepository.findOneByUserId
        ).mockResolvedValue({
            id: reflectionId,
            userId,
            updatedAt: recentUpdatedAt,
        } as any);

        const result = await reflectionService.updateOne(
            userId,
            reflectionId,
            {
                title: "Should not update",
            }
        );

        expect(
            ReflectionRepository.findOneByUserId
        ).toHaveBeenCalledTimes(1);

        // This is the important business-rule assertion.
        expect(
            ReflectionRepository.updateOne
        ).not.toHaveBeenCalled();

        expect(result).toEqual({
            success: false,
            data: null,
            msg: responseMsg.reflection.error.NOT_4_MONTH_OLD,
        });
    });
});