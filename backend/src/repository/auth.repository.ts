import { eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { users, session } from "../db/schema";
import type { userStatus } from "@tamaldip/uvsu-common";

export const authRepository = {
  async findUserById(userId: string) {
    const [row] = await getDb().select().from(users).where(eq(users.id, userId)).limit(1);
    return row ?? null;
  },

  async markOnboardingComplete(userId: string) {
    const [row] = await getDb()
      .update(users)
      .set({ status: "pending", onboardingCompletedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return row ?? null;
  },

  async setStatus(userId: string, status: userStatus) {
    const [row] = await getDb()
      .update(users)
      .set({ status, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return row ?? null;
  },

  //? Important for logging out from specific device and stuff
  async revokeAllSessions(userId: string) {
    await getDb().delete(session).where(eq(session.userId, userId));
  },
};
