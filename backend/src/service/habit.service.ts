import { HabitRepository } from "../repository/habit.repository";

export const HabitService = {
    async allHabits(userId: string) {
        return HabitRepository.findAllHabitsByUserId(userId);  
    },
}