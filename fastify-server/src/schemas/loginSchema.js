export const signUpSchema = {
    body: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                message: { type: "string" },
                userId: { type: "number" },
            },
        },
    },
};

export const loginResponseSchema = {
    body: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                token: { type: "string" },
                user: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        email: { type: "string" },
                    },
                },
            },
        },
    },
};
