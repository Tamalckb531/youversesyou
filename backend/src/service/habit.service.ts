import type { HabitCreateItem } from "@tamaldip/uvsu-common";
import { HabitRepository } from "../repository/habit.repository";
import { dedupeIds } from "../lib/utils";
import { ReflectionRepository } from "../repository/reflection.repository";
import { responseMsg } from "../lib/constants";

export const HabitService = {
    async allHabits(userId: string) {
        return HabitRepository.findAllHabitsByUserId(userId);  
    },

    async createOne(userId: string, item: HabitCreateItem) {
        const allJunctionIds = dedupeIds(item.junctionIdArray);

        const found = await ReflectionRepository.findReflectionsByIds(userId, allJunctionIds);
        const validIds = new Set(found.map((r) => r.id));

        const missing = allJunctionIds.filter((id) => !validIds.has(id));
        if (missing.length > 0) throw new Error(responseMsg.habit.error.INVALID_JUNCTION_IDS)
        
        const newItem = {...item, junctionIdArray:allJunctionIds}
    }
}