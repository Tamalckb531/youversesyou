import type { HabitCreateItem, updateHabitSchemaType } from "@tamaldip/uvsu-common";
import { TEST_REFLECTION, TEST_REFLECTION_IDS, TEST_USER } from "../test-data";
import type { Habit } from "../repository/habit.repository";

export const TEST_HABIT_IDS = [
    "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa",
    "bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb",
    "cccccccc-3333-4333-8333-cccccccccccc",
    "dddddddd-4444-4444-8444-dddddddddddd",
    "eeeeeeee-5555-4555-8555-eeeeeeeeeeee",
    "ffffffff-6666-4666-8666-ffffffffffff",
    "12121212-7777-4777-8777-121212121212",
    "13131313-8888-4888-8888-131313131313",
    "14141414-9999-4999-8999-141414141414",
    "15151515-0000-4000-8000-151515151515",
] as const;


export const TEST_HABITS = [
    {
        id: TEST_HABIT_IDS[0],
        userId: TEST_USER.id,
        name: "Morning Exercise",
        description: "Exercise for 30 minutes every morning",
        color: "#FF5733",
        isArchived: false,
    },
    {
        id: TEST_HABIT_IDS[1],
        userId: TEST_USER.id,
        name: "Read Books",
        description: "Read at least 30 minutes every day",
        color: "#33A1FF",
        isArchived: false,
    },
    {
        id: TEST_HABIT_IDS[2],
        userId: TEST_USER.id,
        name: "Meditation",
        description: "Meditate for 10 minutes every morning",
        color: "#8E44AD",
        isArchived: false,
    },
    {
        id: TEST_HABIT_IDS[3],
        userId: TEST_USER.id,
        name: "Drink Water",
        description: "Drink at least 2 liters of water every day",
        color: "#3498DB",
        isArchived: false,
    },
    {
        id: TEST_HABIT_IDS[4],
        userId: TEST_USER.id,
        name: "Sleep Early",
        description: "Go to sleep before midnight",
        color: "#2C3E50",
        isArchived: false,
    },
    {
        id: TEST_HABIT_IDS[5],
        userId: TEST_USER.id,
        name: "Practice Guitar",
        description: "Practice guitar for at least 30 minutes",
        color: "#E67E22",
        isArchived: false,
    },
    {
        id: TEST_HABIT_IDS[6],
        userId: TEST_USER.id,
        name: "Learn Programming",
        description: "Spend at least one hour learning programming",
        color: "#27AE60",
        isArchived: false,
    },
    {
        id: TEST_HABIT_IDS[7],
        userId: TEST_USER.id,
        name: "Journal",
        description: "Write down thoughts and reflections",
        color: "#F1C40F",
        isArchived: false,
    },
    {
        id: TEST_HABIT_IDS[8],
        userId: TEST_USER.id,
        name: "Walk Outside",
        description: "Take a 20 minute walk outside",
        color: "#16A085",
        isArchived: false,
    },
    {
        id: TEST_HABIT_IDS[9],
        userId: TEST_USER.id,
        name: "No Social Media",
        description: "Avoid unnecessary social media usage",
        color: "#C0392B",
        isArchived: false,
    },
];


// Many-to-many relationship:
//
// One habit -> many reflections
// One reflection -> many habits
//
// Reflection 1 -> habits 1, 2, 3
// Reflection 2 -> habits 1, 4, 5
// Reflection 3 -> habits 2, 5, 6
// etc.

export const TEST_REFLECTION_HABITS = [
    // Habit 1 -> Reflections 1, 2, 3
    {
        reflectionId: TEST_REFLECTION.id,
        habitId: TEST_HABIT_IDS[0],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[0],
        habitId: TEST_HABIT_IDS[0],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[1],
        habitId: TEST_HABIT_IDS[0],
    },

    // Habit 2 -> Reflections 1, 3, 4
    {
        reflectionId: TEST_REFLECTION.id,
        habitId: TEST_HABIT_IDS[1],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[1],
        habitId: TEST_HABIT_IDS[1],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[2],
        habitId: TEST_HABIT_IDS[1],
    },

    // Habit 3 -> Reflections 1, 5, 6
    {
        reflectionId: TEST_REFLECTION.id,
        habitId: TEST_HABIT_IDS[2],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[4],
        habitId: TEST_HABIT_IDS[2],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[5],
        habitId: TEST_HABIT_IDS[2],
    },

    // Habit 4 -> Reflections 2, 4, 7
    {
        reflectionId: TEST_REFLECTION_IDS[0],
        habitId: TEST_HABIT_IDS[3],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[2],
        habitId: TEST_HABIT_IDS[3],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[6],
        habitId: TEST_HABIT_IDS[3],
    },

    // Habit 5 -> Reflections 2, 3, 8
    {
        reflectionId: TEST_REFLECTION_IDS[0],
        habitId: TEST_HABIT_IDS[4],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[1],
        habitId: TEST_HABIT_IDS[4],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[7],
        habitId: TEST_HABIT_IDS[4],
    },

    // Habit 6 -> Reflections 3, 6, 9
    {
        reflectionId: TEST_REFLECTION_IDS[1],
        habitId: TEST_HABIT_IDS[5],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[5],
        habitId: TEST_HABIT_IDS[5],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[8],
        habitId: TEST_HABIT_IDS[5],
    },

    // Habit 7 -> Reflections 4, 7, 10
    {
        reflectionId: TEST_REFLECTION_IDS[2],
        habitId: TEST_HABIT_IDS[6],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[6],
        habitId: TEST_HABIT_IDS[6],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[9],
        habitId: TEST_HABIT_IDS[6],
    },

    // Habit 8 -> Reflections 5, 8, 11
    {
        reflectionId: TEST_REFLECTION_IDS[3],
        habitId: TEST_HABIT_IDS[7],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[7],
        habitId: TEST_HABIT_IDS[7],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[10],
        habitId: TEST_HABIT_IDS[7],
    },

    // Habit 9 -> Reflections 6, 9, 12
    {
        reflectionId: TEST_REFLECTION_IDS[5],
        habitId: TEST_HABIT_IDS[8],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[8],
        habitId: TEST_HABIT_IDS[8],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[11],
        habitId: TEST_HABIT_IDS[8],
    },

    // Habit 10 -> Reflections 7, 10, 13, 14
    {
        reflectionId: TEST_REFLECTION_IDS[6],
        habitId: TEST_HABIT_IDS[9],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[9],
        habitId: TEST_HABIT_IDS[9],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[12],
        habitId: TEST_HABIT_IDS[9],
    },
    {
        reflectionId: TEST_REFLECTION_IDS[13],
        habitId: TEST_HABIT_IDS[9],
    },
];

export const INSERT_HABIT:HabitCreateItem = {
    name: "Morning Exercise",
    description: "Exercise for 30 minutes every morning",
    color: "#FF5733",
    isArchived: false,
    junctionIdArray:[TEST_REFLECTION.id, TEST_REFLECTION_IDS[0]]
}

export const createdHabit = {
    id: TEST_HABIT_IDS[0],
    userId: TEST_USER.id,
    name: "Morning Exercise",
    description: "Exercise for 30 minutes every morning",
    color: "#FF5733",
    isArchived: false,
    linkedIds: [
        TEST_REFLECTION.id,
        TEST_REFLECTION_IDS[0],
    ],
}

export const UPDATE_HABIT_BODY:updateHabitSchemaType = {
    name: "Updated Plan Title",
    isArchived: true,
};

export const TEST_HABIT_LOG = {
  date: "2026-08-24",
}