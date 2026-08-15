export const responseMsg = {
    reflection: {
        success: {
            GET_ALL :"Reflection loaded",
            GET_ONE :"Single reflection loaded",
            CREATED_BULK :"Reflections created successfully",
            UPDATE_ONE :"Reflection updated successfully",
        },
        error: {
            NO_USER_ID: "No id detected",
            NO_REFLECTION_ID: "No reflection detected",
            GENERIC_500: "Something went wrong",
            NOT_4_MONTH_OLD: "This reflection is edited less then 4 months ago",
        }
    },
    plan: {
        success: {
            CREATED_BULK: "Plans created successfully",
        },
        error: {
            INVALID_BODY: "Invalid request body",
            EMPTY_BATCH: "At least one plan is required",
            MIXED_TYPES: "All plans in a single request must share the same type",
            INVALID_JUNCTION_IDS: "One or more linked ids do not exist or do not belong to you",
            INVALID_PARENT_TYPE:
                "Parent plans must be exactly one level above the plan being created",
            DUPLICATE_JUNCTION_IDS_IGNORED: "Duplicate ids in junctionIdArray were ignored",
        },
    },
    generic: {
        error: {
            NO_USER_ID: "No id detected",
            GENERIC_500: "Something went wrong",
        },
    },
}