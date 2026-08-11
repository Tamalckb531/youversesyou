
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

export const INSERT_REFLECTION_ARRAY = [
  {
    type: "goal" as const,
    title: "Test Goal",
    description: "This is a test goal",
    targetDate: new Date("2027-01-01"),
    metadata: null,
    slotIndex: 1,
  },
  {
    type: "pain_point" as const,
    title: "Test Pain Point",
    description: "This is a test pain point",
    targetDate: undefined,
    metadata: null,
    slotIndex: 1,
  },
  {
    type: "dream" as const,
    title: "Test Dream",
    description: "This is a test dream",
    targetDate: undefined,
    metadata: null,
    slotIndex: 1,
  },
];

export const createdReflections = [
    {
        id: "33333333-3333-3333-3333-333333333333",
        userId: TEST_USER.id,
        type: "goal",
        title: "Test Goal",
        description: "This is a test goal",
        targetDate: "2027-01-01",
        metadata: null,
        status: "active",
        slotIndex: 1,
        previousVersionId: null,
    },
    {
        id: "44444444-4444-4444-4444-444444444444",
        userId: TEST_USER.id,
        type: "pain_point",
        title: "Test Pain Point",
        description: "This is a test pain point",
        targetDate: null,
        metadata: null,
        status: "active",
        slotIndex: 1,
        previousVersionId: null,
    },
    {
        id: "55555555-5555-5555-5555-555555555555",
        userId: TEST_USER.id,
        type: "dream",
        title: "Test Dream",
        description: "This is a test dream",
        targetDate: null,
        metadata: null,
        status: "active",
        slotIndex: 1,
        previousVersionId: null,
    },
]
