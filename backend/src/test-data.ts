
import { faker } from "@faker-js/faker";

export const TEST_USER = {
    id: "11111111-1111-1111-1111-111111111111",
    googleId: "google-test-user",
    email: "test@example.com",
    name: "Test User",
    status: "pending" as const,
    onboardingCompletedAt: new Date(),
};

export const TEST_MIDDLEWARE_USER = {
    id: "11111111-1111-1111-1111-111111111111",
    createdAt: new Date(),
    updatedAt: new Date(),
    email: "test@example.com",
    emailVerified: true,
    name: "Test User",
    status: "pending" as const,
    onboardingCompletedAt: new Date(),
};

export const TEST_REFLECTION = {
    id: "22222222-2222-2222-2222-222222222222",
    userId: TEST_USER.id,
    type: "goal" as const,
    title: "Goal 1",
    description: faker.lorem.sentence(),
    targetDate: faker.date.future().toISOString().split("T")[0],
    metadata: null,
    status: "active" as const,
    slotIndex: 1,
    previousVersionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: null,
};
