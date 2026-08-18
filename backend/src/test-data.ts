
import { faker } from "@faker-js/faker";

export const TEST_USER = {
    id: "11111111-1111-4111-8111-111111111111",
    googleId: "google-test-user",
    email: "test@example.com",
    name: "Test User",
    status: "pending" as const,
    onboardingCompletedAt: new Date(),
};

export const TEST_MIDDLEWARE_USER = {
    id: "11111111-1111-4111-8111-111111111111",
    createdAt: new Date(),
    updatedAt: new Date(),
    email: "test@example.com",
    emailVerified: true,
    name: "Test User",
    status: "pending" as const,
    onboardingCompletedAt: new Date(),
};

export const TEST_REFLECTION_IDS = [
  "11111111-1111-4111-8111-111111111112",
  "33333333-3333-4333-8333-333333333333",
  "44444444-4444-4444-8444-444444444444",
  "55555555-5555-4555-8555-555555555555",
  "66666666-6666-4666-8666-666666666666",
  "77777777-7777-4777-8777-777777777777",
  "88888888-8888-4888-8888-888888888888",
  "99999999-9999-4999-8999-999999999999",
  "10101010-1010-4010-8010-101010101010",
  "11111111-1111-4111-8111-111111111111",
  "12121212-1212-4212-8212-121212121212",
  "13131313-1313-4313-8313-131313131313",
  "14141414-1414-4414-8414-141414141414",
  "15151515-1515-4515-8515-151515151515",
  "16161616-1616-4616-8616-161616161616",
]

export const TEST_REFLECTION = {
    id: "22222222-2222-4222-8222-222222222222",
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
        id: "33333333-3333-4333-8333-333333333333",
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
        id: "44444444-4444-4444-8444-444444444444",
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
        id: "55555555-5555-4555-8555-555555555555",
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
