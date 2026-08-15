import { eq, inArray, and } from "drizzle-orm";
import { getDb } from "../db";
import { plans, planRelations, reflectionPlans, reflections } from "../db/schema";
 
export type NewPlan = typeof plans.$inferInsert;
export type Plan = typeof plans.$inferSelect;

export const PlanRepository = {
    
}