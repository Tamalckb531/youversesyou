import { faker } from "@faker-js/faker";
import { db } from "./db";
import { reflections, users } from "./db/schema";


export const TEST_USER = {
  id: "11111111-1111-1111-1111-111111111111",
  googleId: "google-test-user",
  email: "test@example.com",
  name: "Test User",
  status: "pending" as const,
  onboardingCompletedAt: new Date(),
};

export async function seed() {
  // Clear old data
  await db.delete(reflections);
  await db.delete(users);

  // Insert static user
  await db.insert(users).values(TEST_USER);

  const reflectionRows = [];

  // Goals
  for (let i = 1; i <= 5; i++) {
    reflectionRows.push({
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

  await db.insert(reflections).values(reflectionRows);

  console.log("✅ Test database seeded");
}