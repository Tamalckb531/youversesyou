import type { createReflectionType, updateReflectionSchemaType } from "@tamaldip/uvsu-common";
import type { NewReflection, PartialReflection } from "../repository/reflection.repository";

export const toInsertRow = (input:createReflectionType, userId:string):NewReflection => {
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

export const toUpdateRow = (
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

export const DAYS_120 = 120;
export const MS_PER_DAY = 24 * 60 * 60 * 1000;
