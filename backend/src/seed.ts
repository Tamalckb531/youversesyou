import { faker } from "@faker-js/faker";
import { getDb } from "./db";
import { habitLogs, habits, habitStreaks, planRelations, plans, reflectionHabits, reflectionPlans, reflections, users } from "./db/schema";
import { TEST_REFLECTION, TEST_REFLECTION_IDS, TEST_USER } from "./test-data";
import { TEST_PLAN_RELATIONS, TEST_PLANS, TEST_REFLECTION_PLANS } from "./data/plan-test-data";
import { HABIT_LOGS, TEST_HABITS, TEST_REFLECTION_HABITS } from "./data/habit-test.data";


async function seed() {
  // Clear old data
  // Clear old data
  await getDb().delete(planRelations);
  await getDb().delete(reflectionPlans);
  await getDb().delete(reflectionHabits);
  await getDb().delete(plans);
  await getDb().delete(habits);
  await getDb().delete(habitLogs);
  await getDb().delete(habitStreaks);
  await getDb().delete(reflections);
  await getDb().delete(users);

  // Insert static user
  await getDb().insert(users).values(TEST_USER);

  const reflectionRows = [];

  // Goals
  reflectionRows.push(TEST_REFLECTION);

  for (let i = 1; i <= 4; i++) {
    reflectionRows.push({
      id:TEST_REFLECTION_IDS[i-1], //? 0 1 2 3
      userId: TEST_USER.id,
      type: "goal" as const,
      title: `Goal ${i}`,
      description: faker.lorem.sentence(),
      targetDate: faker.date.future().toISOString().split("T")[0],
      metadata: null,
      status: "active" as const,
      slotIndex: i,
      previousVersionId: null,
      archivedAt: null,
    });
  }

  // Pain Points
  for (let i = 1; i <= 5; i++) {
    reflectionRows.push({
      id:TEST_REFLECTION_IDS[i+3], //? 4 5 6 7 8
      userId: TEST_USER.id,
      type: "pain_point" as const,
      title: `Pain Point ${i}`,
      description: faker.lorem.sentence(),
      targetDate: null,
      metadata: null,
      status: "active" as const,
      slotIndex: i,
      previousVersionId: null,
      archivedAt: null,
    });
  }

  // Dreams
  for (let i = 1; i <= 5; i++) {
    reflectionRows.push({
      id:TEST_REFLECTION_IDS[i+8], //? 9 10 11 12 13 
      userId: TEST_USER.id,
      type: "dream" as const,
      title: `Dream ${i}`,
      description: faker.lorem.sentence(),
      targetDate: null,
      metadata: null,
      status: "active" as const,
      slotIndex: i,
      previousVersionId: null,
      archivedAt: null,
    });
  }

  await getDb().insert(reflections).values(reflectionRows);
  await getDb().insert(plans).values(TEST_PLANS);
  await getDb()
    .insert(reflectionPlans)
    .values(TEST_REFLECTION_PLANS);
  await getDb()
    .insert(planRelations)
    .values(TEST_PLAN_RELATIONS);
  
  await getDb().insert(habits).values(TEST_HABITS);

  await getDb()
      .insert(reflectionHabits)
      .values(TEST_REFLECTION_HABITS);
  
  await getDb().insert(habitLogs).values(HABIT_LOGS);
  

  console.log("✅ Test database seeded");
}

seed().catch((err) => {
    console.error("❌ Failed to seed database:", err);
    process.exit(1);
});