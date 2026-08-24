export const responseMsg = {
    reflection: {
        success: {
            GET_ALL :"Reflection loaded",
            GET_ONE :"Single reflection loaded",
            CREATED_BULK :"Reflections created successfully",
            UPDATE_ONE :"Reflection updated successfully",
        },
        error: {
            NO_USER_ID: "No user id detected",
            NO_REFLECTION_ID: "No reflection detected",
            GENERIC_500: "Something went wrong",
            NOT_4_MONTH_OLD: "This reflection is edited less then 4 months ago",
        }
    },
    plan: {
        success: {
            GET_ALL: "Plans loaded",
            GET_ONE :"Single plan loaded",
            CREATED_BULK: "Plans created successfully",
            UPDATE_ONE :"Plan updated successfully",
        },
        error: {
            INVALID_BODY: "Invalid request body",
            NO_PLAN_ID: "No plan detected",
            EMPTY_BATCH: "At least one plan is required",
            MIXED_TYPES: "All plans in a single request must share the same type",
            INVALID_JUNCTION_IDS: "One or more linked ids do not exist or do not belong to you",
            INVALID_PARENT_TYPE:
                "Parent plans must be exactly one level above the plan being created",
            DUPLICATE_JUNCTION_IDS_IGNORED: "Duplicate ids in junctionIdArray were ignored",
        },
    },
    habit: {
        success: {
            GET_ALL: "Habits loaded",
            GET_ONE :"Single habit loaded",
            CREATED_BULK: "Habit created successfully",
            UPDATE_ONE :"Habit updated successfully",
            MARKED :"Habit marked successfully",
            UNMARKED :"Habit unmarked successfully",
            DELETED :"Habit deleted successfully",
        },
        error: {
            INVALID_BODY: "Invalid request body",
            NO_HABIT_ID: "No habit detected",
            INVALID_JUNCTION_IDS: "One or more linked ids do not exist or do not belong to you",
            DUPLICATE_JUNCTION_IDS_IGNORED: "Duplicate ids in junctionIdArray were ignored",
        },
    },
    todo: {
        success: {
            GET_ALL: "Todos loaded",
            GET_ONE :"Single todo loaded",
            CREATED_BULK: "Todo created successfully",
            UPDATE_ONE :"Todo updated successfully",
            MARKED :"Todo marked successfully",
            UNMARKED :"Todo unmarked successfully",
            DELETED :"Todo deleted successfully",
        },
        error: {
            INVALID_BODY: "Invalid request body",
            NO_TODO_ID: "No todo detected",
            INVALID_LINK_ID: "linked id do not exist or do not belong to you",
        },
    },
    generic: {
        error: {
            NO_USER_ID: "No user id detected",
            GENERIC_500: "Something went wrong",
        },
    },
}