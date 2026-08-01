import type { createReflectionType } from "@tamaldip/uvsu-common";
import { ReflectionRepository, type NewReflection } from "../repository/reflection.repository"

const toInsertRow = (input:createReflectionType, userId:string):NewReflection => {
    return {
        userId,
        type: input.type,
        title: input.title,
        description: input.description ?? null,
        targetDate: input.targetDate ? input.targetDate.toISOString().slice(0, 10) : null,
        metadata: input.metadata ?? null,
        status: "active",
        slotIndex:input.slotIndex,
        previousVersionId: null,
        archivedAt: null,
    };
}

export const reflectionService = {
    async listForUser(userId: string) {
        return ReflectionRepository.findAllByUserId(userId);
    }, 

    async bulkCreate(userId: string, items: createReflectionType[]) {
        const rows = items.map((item, _i) => toInsertRow(item, userId));
        return ReflectionRepository.bulkCreate(rows);
    },
}