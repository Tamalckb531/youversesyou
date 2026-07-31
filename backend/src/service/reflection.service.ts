import { ReflectionRepository } from "../repository/reflection.repository"

export const reflectionService = {
    async listForUser(userId: string) {
        return ReflectionRepository.findAllByUserId(userId);
    }
}