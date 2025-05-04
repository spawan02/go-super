export const expenseSchema = {
    body: {
        type: "object",
        required: ["amount", "category"],
        properties: {
            amount: { type: "number" },
            category: { type: "string", enum: ["Income", "Expense"] },
            description: { type: "string" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                totalIncome: { type: 'number' },
                totalExpense: { type: 'number' },
                expenses: {
                    type: 'array',
                    items:{
                        type: 'object', 
                        properties: {
                            id: { type: "integer" },
                            amount: { type: "number" },
                            category: { type: "string" },
                            description: { type: "string" },
                            createdAt: { type: "string", format: "date-time" },
                        }
                    }
                 },
            required: ["id", "amount", "category", "createdAt"],
            },
        }
    },
};


  