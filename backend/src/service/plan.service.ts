
import type { PlanBulkCreateInput, PlanType } from "@tamaldip/uvsu-common";
import { PlanRepository } from "../repository/plan.repository";
import { toNewPlan, dedupeIds } from "../lib/utils";
import { ReflectionRepository } from "../repository/reflection.repository";
 
export class PlanValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanValidationError";
  }
}

const PARENT_TYPE: Record<PlanType, PlanType | null> = {
  overall: null,
  yearly: "overall",
  monthly: "yearly",
  weekly: "monthly",
};
 

export const PlanService = {
    async bulkCreate(userId: string, items: PlanBulkCreateInput) {
        // zod already guarantees non-empty + same-type-per-batch, but re-assert here
        // since services shouldn't blindly trust upstream layers either.
        if (items.length === 0) {
            throw new PlanValidationError("EMPTY_BATCH");
        }
        
        const type = items[0].type;

        if (!items.every((i) => i.type === type)) {
            throw new PlanValidationError("MIXED_TYPES");
        }
    
        const isOverall = type === "overall";
        const expectedParentType = PARENT_TYPE[type];
    
        // gather every distinct junction id across the whole batch to validate in one query
        const allJunctionIds = dedupeIds(items.flatMap((i) => dedupeIds(i.junctionIdArray)));
    
        let validIds: Set<string>;
        if (isOverall) {
            const found = await ReflectionRepository.findReflectionsByIds(userId, allJunctionIds);
            validIds = new Set(found.map((r) => r.id));
        } else {
            const found = await PlanRepository.findPlansByIds(userId, allJunctionIds);
            const wrongType = found.filter((p) => p.type !== expectedParentType);
            if (wrongType.length > 0) {
                throw new PlanValidationError("INVALID_PARENT_TYPE");
            }
            validIds = new Set(found.map((p) => p.id));
        }
    
        // any id the user sent that we couldn't resolve (wrong owner, wrong type, or nonexistent)
        // fails the whole batch — bulk create is all-or-nothing.
        const missing = allJunctionIds.filter((id) => !validIds.has(id));
        if (missing.length > 0) {
            throw new PlanValidationError("INVALID_JUNCTION_IDS");
        }
    
        const preparedItems = items.map((item) => ({
            plan: toNewPlan(item),
            junctionIds: dedupeIds(item.junctionIdArray),
            junctionKind: (isOverall ? "reflection" : "plan") as "reflection" | "plan",
        }));
    
        return PlanRepository.bulkCreateWithJunctions(userId, preparedItems);
    },
}