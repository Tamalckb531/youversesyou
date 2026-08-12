import type { createReflectionType, updateReflectionSchemaType } from "@tamaldip/uvsu-common";
import { ReflectionRepository } from "../repository/reflection.repository"
import { DAYS_120, MS_PER_DAY, toInsertRow, toUpdateRow } from "../lib/utils";
import { responseMsg } from "../lib/constants";



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
        const currentReflection = await ReflectionRepository.findOneByUserId(reflectionId, userId);

        const is4MonthOld = Date.now() - currentReflection.updatedAt.getTime() >= DAYS_120 * MS_PER_DAY;

        if (!is4MonthOld) return { success: false, data: null, msg: responseMsg.reflection.error.NOT_4_MONTH_OLD };
        
        const toUpdatedItem = toUpdateRow(item);

        const updatedItem = await ReflectionRepository.updateOne(toUpdatedItem, reflectionId, userId);

        return { success: true, data: updatedItem, msg:responseMsg.reflection.success.UPDATE_ONE };
    }
}