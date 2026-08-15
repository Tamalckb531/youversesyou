
import type { PlanBulkCreateInput, PlanType } from "@tamaldip/uvsu-common";
import { PlanRepository } from "../repository/plan.repository";
import { toNewPlan, dedupeIds } from "../lib/utils";
 
export class PlanValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanValidationError";
  }
}

export const PlanService = {
    
}