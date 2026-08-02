import type { createReflectionType, updateReflectionSchemaType } from "@tamaldip/uvsu-common";
import { ReflectionRepository, type NewReflection, type PartialReflection } from "../repository/reflection.repository"

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
    };
}

const toUpdateRow = (
        input: updateReflectionSchemaType
    ): PartialReflection => {
        const row: PartialReflection = {};

        if (input.type !== undefined) row.type = input.type;
        if (input.title !== undefined) row.title = input.title;
        if (input.description !== undefined) row.description = input.description;
        if (input.targetDate !== undefined) {
            row.targetDate = input.targetDate
            ? input.targetDate.toISOString().slice(0, 10)
            : null;
        }
        if (input.metadata !== undefined) row.metadata = input.metadata;
        if (input.status !== undefined) row.status = input.status;
        if (input.status === "archived") row.archivedAt = new Date();
        if (input.slotIndex !== undefined) row.slotIndex = input.slotIndex;

        row.updatedAt = new Date();

        return row;
};

const DAYS_120 = 120;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const reflectionService = {
    async listForUser(userId: string) {
        return ReflectionRepository.findAllByUserId(userId);
    }, 

    async oneForUser(reflectionId:string, userId: string) {
        return ReflectionRepository.findOneByUserId(reflectionId, userId);
    }, 

    async bulkCreate(userId: string, items: createReflectionType[]) {
        const rows = items.map((item, _i) => toInsertRow(item, userId));
        return ReflectionRepository.bulkCreate(rows);
    },

    async updateOne(userId: string, reflectionId: string, item: updateReflectionSchemaType) {
        /* //TODO : Get the reflection with userId and id -> return 400 error if not found
        !If exist :
        ? 1. First check if the reflection row is created 4 months ago or not. If not then send the can't change message.
        ? 2. There is no delete, so user can only archive their reflections. If archive then also add archivedAt : Date.now()
        */
        
        const currentReflection = await ReflectionRepository.findOneByUserId(reflectionId, userId);

        const is4MonthOld = Date.now() - currentReflection.updatedAt.getTime() >= DAYS_120 * MS_PER_DAY;

        if (!is4MonthOld) return { success: false, data: null, msg: "This reflection is edited less then 4 months ago" };
        
        const toUpdatedItem = toUpdateRow(item);

        const updatedItem = await ReflectionRepository.updateOne(toUpdatedItem, reflectionId, userId);

        return { success: true, data: updatedItem, msg:"Reflection updated successfully" };
    }
}