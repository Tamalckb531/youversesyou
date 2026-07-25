
import { HTTPException } from "hono/http-exception";
import { authRepository } from "../repository/auth.repository";
import type { AuthUser } from "../lib/auth";
import type { MeResponse, userStatus } from "@tamaldip/uvsu-common";

export const authService = {
  toMeResponse(user: AuthUser): MeResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status as userStatus,
      onboardingCompletedAt: user.onboardingCompletedAt
        ? new Date(user.onboardingCompletedAt)
        : null,
    };
  },

  async completeOnboarding(userId: string) {
    const current = await authRepository.findUserById(userId);
    if (!current) throw new HTTPException(404, { message: "User not found." });

    if (current.status !== "pending") {
      throw new HTTPException(409, {
        message: "Onboarding was already completed for this account.",
      });
    }

    const updated = await authRepository.markOnboardingComplete(userId);
    if (!updated) throw new HTTPException(500, { message: "Failed to complete onboarding." });
    return updated;
  },

//   async restrictAccount(userId: string, status: Extract<userStatus, "suspended" | "banned">) {
//     const updated = await authRepository.setStatus(userId, status);
//     if (!updated) throw new HTTPException(404, { message: "User not found." });
//     await authRepository.revokeAllSessions(userId);
//     return updated;
//   },

//   async reinstateAccount(userId: string) {
//     const updated = await authRepository.setStatus(userId, "pending");
//     if (!updated) throw new HTTPException(404, { message: "User not found." });
//     return updated;
//   },
};
