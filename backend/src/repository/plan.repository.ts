import { eq, inArray, and, or } from "drizzle-orm";
import { getDb } from "../db";
import { plans, planRelations, reflectionPlans, reflections } from "../db/schema";
import { toIds } from "../lib/utils";
import type { updatePlanSchemaType } from "@tamaldip/uvsu-common";
import { responseMsg } from "../lib/constants";
 
export type NewPlan = typeof plans.$inferInsert;
export type Plan = typeof plans.$inferSelect;

export const PlanRepository = {
    async findAllPlansByUserId(userId: string) {
        return await getDb()
            .select()
            .from(plans)
            .where(eq(plans.userId, userId));
    },

    async findOnePlanByUserId(planId: string, userId: string) {
        const db = getDb();

        const [plan] = await db
            .select()
            .from(plans)
            .where(
                and(
                    eq(plans.id, planId),
                    eq(plans.userId, userId),
                ),
            );

        if (!plan) {
            throw new Error(responseMsg.plan.error.NO_PLAN_ID)
        }

        if (plan.type === "overall") {
            const connections = await db
                .select({
                    id: reflectionPlans.reflectionId,
                })
                .from(reflectionPlans)
                .where(eq(reflectionPlans.planId, plan.id));

            const connectionIds = connections.map(({ id }) => id);

            const relatedConnections =
                connectionIds.length > 0
                    ? await db
                        .select()
                        .from(reflections)
                        .where(
                            and(
                                eq(reflections.userId, userId),
                                inArray(reflections.id, connectionIds),
                            ),
                        )
                    : [];

            return {
                plan,
                relatedConnections,
            };
        }

        const connections = await db
            .select({
                id: planRelations.parentPlanId,
            })
            .from(planRelations)
            .where(
                eq(planRelations.childPlanId, plan.id),
            );

        const connectionIds = connections.map(({ id }) => id);

        const relatedConnections =
            connectionIds.length > 0
                ? await db
                    .select()
                    .from(plans)
                    .where(
                        and(
                            eq(plans.userId, userId),
                            inArray(plans.id, connectionIds),
                        ),
                    )
                : [];

        return {
            plan,
            relatedConnections,
        };
    },

    async findOnePlanByUserIdWithoutCon(planId: string, userId: string) {
        return await getDb()
            .select()
            .from(plans)
            .where(
                and(
                    eq(plans.id, planId),
                    eq(plans.userId, userId),
                ),
            );
    },

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

    async updateOnePlan(rows: updatePlanSchemaType, planId: string, userId: string) {
            const [reflection] = await getDb()
                .update(plans)
                .set(rows)
                .where(
                    and(
                        eq(reflections.userId, userId),
                        eq(reflections.id, planId)
                    )
                )
                .returning();
            
            return reflection;
    }
    
}