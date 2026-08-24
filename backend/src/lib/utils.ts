import type { createReflectionType, updateReflectionSchemaType, PlanCreateItem, HabitCreateItem } from "@tamaldip/uvsu-common";
import type { NewReflection, PartialReflection } from "../repository/reflection.repository";
import type { NewPlan } from "../repository/plan.repository";
import type { NewHabit } from "../repository/habit.repository";

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

export function toNewPlan(item: PlanCreateItem): Omit<NewPlan, "userId"> {
  return {
    title: item.title,
    description: item.description ?? null,
    type: item.type,
    time: item.time,
    status: "active",
  };
}
export function toNewHabit(item: HabitCreateItem): Omit<NewHabit, "userId"> {
  return {
    name: item.name,
    description: item.description ?? null,
    color: item.color,
    isArchived: item.isArchived
  };
}
 
export function dedupeIds(ids: string[]): string[] {
  return Array.from(new Set(ids));
}
 
export const toIds = (items: { id: string }[]): string[] => items.map((item) => item.id);

export const calculateStreaks = (sortedDates: string[]): {
    currentStreak: number;
    longestStreak: number;
} => {
    if (sortedDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let longestStreak = 1;
    let runningStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const dayDiff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

        if (dayDiff === 1) {
            runningStreak += 1;
        } else {
            runningStreak = 1; // gap — streak restarts
        }
        longestStreak = Math.max(longestStreak, runningStreak);
    }

    // currentStreak only counts if the streak actually reaches today or yesterday —
    // otherwise the habit is currently "broken" even if it once had a long run.
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    const today = new Date(new Date().toISOString().slice(0, 10));
    const gapFromToday = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

    const currentStreak = gapFromToday <= 1 ? runningStreak : 0;

    return { currentStreak, longestStreak };
}