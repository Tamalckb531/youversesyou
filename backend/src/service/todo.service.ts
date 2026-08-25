
export const TodoService = {
    async allTodos(userId: string) {
        return TodoRepository.findAllHabitsByUserId(userId);  
    },
}