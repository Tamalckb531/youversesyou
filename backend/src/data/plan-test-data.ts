import { TEST_REFLECTION, TEST_REFLECTION_IDS, TEST_USER } from "../test-data";

export const TEST_PLAN_IDS = [
  // Overall
  "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",

  // Yearly
  "cccccccc-cccc-cccc-cccc-cccccccccccc",
  "dddddddd-dddd-dddd-dddd-dddddddddddd",

  // Monthly
  "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
  "ffffffff-ffff-ffff-ffff-ffffffffffff",

  // Weekly
  "12121212-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "13131313-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
] as const;


export const TEST_PLANS = [
  // Overall
  {
    id: TEST_PLAN_IDS[0],
    userId: TEST_USER.id,
    title: "Overall Plan 1",
    description: "Test overall plan 1",
    type: "overall" as const,
    time: null,
    status: "active" as const,
  },
  {
    id: TEST_PLAN_IDS[1],
    userId: TEST_USER.id,
    title: "Overall Plan 2",
    description: "Test overall plan 2",
    type: "overall" as const,
    time: null,
    status: "active" as const,
  },

  // Yearly
  {
    id: TEST_PLAN_IDS[2],
    userId: TEST_USER.id,
    title: "Yearly Plan 1",
    description: "Test yearly plan 1",
    type: "yearly" as const,
    time: "2026",
    status: "active" as const,
  },
  {
    id: TEST_PLAN_IDS[3],
    userId: TEST_USER.id,
    title: "Yearly Plan 2",
    description: "Test yearly plan 2",
    type: "yearly" as const,
    time: "2027",
    status: "active" as const,
  },

  // Monthly
  {
    id: TEST_PLAN_IDS[4],
    userId: TEST_USER.id,
    title: "Monthly Plan 1",
    description: "Test monthly plan 1",
    type: "monthly" as const,
    time: "Jan",
    status: "active" as const,
  },
  {
    id: TEST_PLAN_IDS[5],
    userId: TEST_USER.id,
    title: "Monthly Plan 2",
    description: "Test monthly plan 2",
    type: "monthly" as const,
    time: "Feb",
    status: "active" as const,
  },

  // Weekly
  {
    id: TEST_PLAN_IDS[6],
    userId: TEST_USER.id,
    title: "Weekly Plan 1",
    description: "Test weekly plan 1",
    type: "weekly" as const,
    time: "Week1",
    status: "active" as const,
  },
  {
    id: TEST_PLAN_IDS[7],
    userId: TEST_USER.id,
    title: "Weekly Plan 2",
    description: "Test weekly plan 2",
    type: "weekly" as const,
    time: "Week2",
    status: "active" as const,
  },
];

export const TEST_REFLECTION_PLANS = [
  // Reflection 1 -> both Overall plans
  {
    reflectionId: TEST_REFLECTION.id,
    planId: TEST_PLAN_IDS[0],
  },
  {
    reflectionId: TEST_REFLECTION.id,
    planId: TEST_PLAN_IDS[1],
  },

  // Reflection 2 -> both Overall plans
  {
    reflectionId: TEST_REFLECTION_IDS[0],
    planId: TEST_PLAN_IDS[0],
  },
  {
    reflectionId: TEST_REFLECTION_IDS[0],
    planId: TEST_PLAN_IDS[1],
  },
];

export const TEST_PLAN_RELATIONS = [
  // Both Overall -> both Yearly
  {
    parentPlanId: TEST_PLAN_IDS[0],
    childPlanId: TEST_PLAN_IDS[2],
  },
  {
    parentPlanId: TEST_PLAN_IDS[0],
    childPlanId: TEST_PLAN_IDS[3],
  },
  {
    parentPlanId: TEST_PLAN_IDS[1],
    childPlanId: TEST_PLAN_IDS[2],
  },
  {
    parentPlanId: TEST_PLAN_IDS[1],
    childPlanId: TEST_PLAN_IDS[3],
  },

  // Both Yearly -> both Monthly
  {
    parentPlanId: TEST_PLAN_IDS[2],
    childPlanId: TEST_PLAN_IDS[4],
  },
  {
    parentPlanId: TEST_PLAN_IDS[2],
    childPlanId: TEST_PLAN_IDS[5],
  },
  {
    parentPlanId: TEST_PLAN_IDS[3],
    childPlanId: TEST_PLAN_IDS[4],
  },
  {
    parentPlanId: TEST_PLAN_IDS[3],
    childPlanId: TEST_PLAN_IDS[5],
  },

  // Both Monthly -> both Weekly
  {
    parentPlanId: TEST_PLAN_IDS[4],
    childPlanId: TEST_PLAN_IDS[6],
  },
  {
    parentPlanId: TEST_PLAN_IDS[4],
    childPlanId: TEST_PLAN_IDS[7],
  },
  {
    parentPlanId: TEST_PLAN_IDS[5],
    childPlanId: TEST_PLAN_IDS[6],
  },
  {
    parentPlanId: TEST_PLAN_IDS[5],
    childPlanId: TEST_PLAN_IDS[7],
  },
];