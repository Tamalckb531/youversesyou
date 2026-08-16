import { faker } from "@faker-js/faker";
import { getDb } from "./db";
import { reflections, users } from "./db/schema";
import { TEST_REFLECTION, TEST_REFLECTION_IDS, TEST_USER } from "./test-data";


async function seed() {
  // Clear old data
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

  console.log("✅ Test database seeded");
}

seed().catch((err) => {
    console.error("❌ Failed to seed database:", err);
    process.exit(1);
});