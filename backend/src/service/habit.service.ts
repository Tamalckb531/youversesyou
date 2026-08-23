import type { HabitCreateItem, updateHabitSchemaType } from "@tamaldip/uvsu-common";
import { HabitRepository } from "../repository/habit.repository";
import { dedupeIds, toNewHabit } from "../lib/utils";
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
        
        const newItem = { habit: toNewHabit(item), junctionIdArray: allJunctionIds }
        
        return HabitRepository.createWithJunctions(userId, newItem)
    },

    async updateHabit(userId: string, habitId: string, item: updateHabitSchemaType) {
        const currentHabit = await HabitRepository.findOneHabitByUserIdWithoutCon(habitId, userId);        
        if (!currentHabit) throw new Error(responseMsg.habit.error.NO_HABIT_ID);
        return HabitRepository.updateOneHabit(item, habitId, userId);
    },

    async deleteHabit(userId: string, habitId: string) {
        const deletedHabit = await HabitRepository.deleteHabit(habitId, userId);        
        if (!deletedHabit) throw new Error(responseMsg.habit.error.NO_HABIT_ID);
        return deletedHabit.id;
    }
}