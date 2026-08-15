import { eq, inArray, and } from "drizzle-orm";
import { getDb } from "../db";
import { plans, planRelations, reflectionPlans, reflections } from "../db/schema";
 
export type NewPlan = typeof plans.$inferInsert;
export type Plan = typeof plans.$inferSelect;

export const PlanRepository = {
    async findPlansByIds(userId: string, ids: string[]) {
        if (ids.length === 0) return [];
        return await getDb()
        .select({ id: plans.id, type: plans.type })
        .from(plans)
        .where(and(eq(plans.userId, userId), inArray(plans.id, ids)));
    },

    async bulkCreateWithJunctions(
        userId: string,
        items: Array<{
            plan: Omit<NewPlan, "userId">;
            junctionIds: string[];
            junctionKind: "reflection" | "plan";
        }>,
    ): Promise<Array<Plan & { linkedIds: string[] }>> {
        const db = getDb();

        return await db.transaction(async (tx) => {
            const results: Array<Plan & { linkedIds: string[] }> = [];
        
            for (const item of items) {
                const [inserted] = await tx
                    .insert(plans)
                    .values({ ...item.plan, userId })
                    .returning();
        
                if (item.junctionIds.length > 0) {
                    if (item.junctionKind === "reflection") {
                        await tx.insert(reflectionPlans).values(
                            item.junctionIds.map((reflectionId) => ({
                                reflectionId,
                                planId: inserted.id,
                            })),
                        );
                    } else {
                        await tx.insert(planRelations).values(
                        item.junctionIds.map((parentPlanId) => ({
                            parentPlanId,
                            childPlanId: inserted.id,
                        })),
                        );
                    }
                }
        
                results.push({ ...inserted, linkedIds: item.junctionIds });
            }
        
            return results;
        });
    },
}