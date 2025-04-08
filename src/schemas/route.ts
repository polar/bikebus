export const routeSchema = {
    $id: "routeSchema",
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
} as const;
