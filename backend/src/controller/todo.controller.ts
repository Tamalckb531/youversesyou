import type { Context } from "hono";
import { responseMsg } from "../lib/constants";
import { TodoService } from "../service/todo.service";

export const TodoGetController = async (c: Context) => { 
    try {
        const user = c.get("user");
        const userId = user.id;

        if (!userId) return c.json({
            success: false,
            msg: responseMsg.generic.error.NO_USER_ID,
            data: null
        }, 400);

        const items = await TodoService.allTodos(userId)
        
        return c.json({
            success: true,
            msg:responseMsg.todo.success.GET_ALL,
            data: items,
        })
    }
    catch (err) {
        return c.json({
            success: false,
            msg: err instanceof Error ? err.message : responseMsg.generic.error.GENERIC_500,
            data:null
        }, 500); 
    }
}

export const TodoGetOneController = async (c: Context) => { 
    try {
        const id = c.req.param("id");
        const user = c.get("user");
        const userId = user.id;

        if (!id) return c.json({
            success: false,
            msg: responseMsg.todo.error.NO_TODO_ID,
            data: null
        }, 400);
        if (!userId) return c.json({
            success: false,
            msg: responseMsg.generic.error.NO_USER_ID,
            data: null
        }, 400);

        const item = await TodoService.oneTodo(userId, id);
        
        return c.json({
            success: true,
            msg:responseMsg.todo.success.GET_ONE,
            data: item,
        })
    }
    catch (err) {
        return c.json({
            success: false,
            msg: err instanceof Error ? err.message : responseMsg.generic.error.GENERIC_500,
            data:null
        }, 500); 
    }
}

export const TodoCreateController = async (c: Context) => { 
    try {
        const user = c.get("user");
        const userId = user.id;

        if (!userId) return c.json({
            success: false,
            msg: responseMsg.generic.error.NO_USER_ID,
            data: null
        }, 400);

        const body: unknown = await c.req.json();

        const result = todoCreateItemBaseSchema.safeParse(body);
        if (!result.success) {
            const issue = result.error.issues[0];
            return c.json(
                {
                    success: false,
                    msg: `${issue.message} on field: ${issue.path.join(".")}`,
                    data: null
                },
                400,
            );
        }

        const created = await TodoService.createOne(userId, result.data);
        return c.json({
            success: true,
            msg:responseMsg.todo.success.CREATED_BULK,
            data: created
        }, 201);
    }
    catch (err) {
        return c.json(
            {
                success: false,
                msg: err instanceof Error ? err.message : responseMsg.generic.error.GENERIC_500, data: null
            },
            500,
        );
    }
}

export const TodoPatchController = async (c: Context) => {
    try {
        const id = c.req.param("id");

        const user = c.get("user");
        const userId = user.id;

        if (!id) return c.json({
            success: false,
            msg: responseMsg.todo.error.NO_TODO_ID,
            data: null
        }, 400);
        if (!userId) return c.json({
            success: false,
            msg: responseMsg.generic.error.NO_USER_ID,
            data: null
        }, 400);

        const body: unknown = await c.req.json();

        const result = updateTodoSchema.safeParse(body);
        if (!result.success) {
            const issue = result.error.issues[0];
            return c.json(
                {
                    success: false,
                    msg: `${issue.message} on field: ${issue.path.join(".")}`,
                    data: null
                },
                400,
            );
        }

        const updated = await TodoService.updateTodo(userId, id, result.data);

        return c.json({
            success: true,
            msg: responseMsg.todo.success.UPDATE_ONE,
            data: updated
        }, 201);
    }
    catch (err) {
        return c.json(
            {
                success: false,
                msg: err instanceof Error ? err.message : responseMsg.generic.error.GENERIC_500, 
                data: null
            },
            500,
        );
    }
}

export const TodoDeleteController = async (c: Context) => { 
    try {
        const id = c.req.param("id");

        const user = c.get("user");
        const userId = user.id;

        if (!id) return c.json({
            success: false,
            msg: responseMsg.todo.error.NO_TODO_ID,
            data: null
        }, 400);
        if (!userId) return c.json({
            success: false,
            msg: responseMsg.generic.error.NO_USER_ID,
            data: null
        }, 400);

        const deletedHabitId = await TodoService.deleteTodo(userId, id);

        return c.json({
            success: true,
            msg: responseMsg.todo.success.DELETED,
            data: deletedHabitId
        }, 201);
    }
    catch (err) {
        return c.json(
            {
                success: false,
                msg: err instanceof Error ? err.message : responseMsg.generic.error.GENERIC_500, 
                data: null
            },
            500,
        );
    }
}

export const TodoMarkController = async (c: Context) => { 
    try {
        const id = c.req.param("id");

        const user = c.get("user");
        const userId = user.id;

        if (!id) return c.json({
            success: false,
            msg: responseMsg.todo.error.NO_TODO_ID,
            data: null
        }, 400);
        if (!userId) return c.json({
            success: false,
            msg: responseMsg.generic.error.NO_USER_ID,
            data: null
        }, 400);

        const mark = await TodoService.markedTodo(userId, id);

        return c.json({
            success: true,
            msg: mark.marked ? responseMsg.todo.success.MARKED : responseMsg.todo.success.UNMARKED,
            data: mark
        }, 201);
    }
    catch (err) {
        return c.json(
            {
                success: false,
                msg: err instanceof Error ? err.message : responseMsg.generic.error.GENERIC_500, 
                data: null
            },
            500,
        );
    }    
}