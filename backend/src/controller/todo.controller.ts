import type { Context } from "hono";
import { responseMsg } from "../lib/constants";

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
}

export const TodoCreateController = async (c: Context) => { 
}

export const TodoPatchController = async (c: Context) => {
}

export const TodoDeleteController = async (c: Context) => { 
}

export const TodoMarkController = async (c: Context) => { 
}