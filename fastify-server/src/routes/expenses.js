import {
    createExpenseSchema,
    deleteExpenseSchema,
    getExpensesSchema,
} from "../schemas/expenseSchema.js";

export default async function (fastify) {
    fastify.get("/expenses", {
        schema: getExpensesSchema,
        preHandler: [fastify.authenticate],
        handler: async (request, reply) => {
            try {
                const userId = request.userId;

                const expenses = await prisma.expense.findMany({
                    where: { userId },
                    orderBy: { createdAt: "desc" },
                });

                const totalIncome = expenses
                    .filter((e) => e.category === "Income")
                    .reduce((sum, e) => sum + e.amount, 0);

                const totalExpense = expenses
                    .filter((e) => e.category === "Expense")
                    .reduce((sum, e) => sum + e.amount, 0);

                reply.send({ totalIncome, totalExpense, expenses });
            } catch (err) {
                reply.status(500).send({ error: err.message });
            }
        },
    });

    fastify.post("/expenses", {
        preHandler: [fastify.authenticate],
        schema: createExpenseSchema,

        handler: async (request, reply) => {
            try {
                const { amount, category, description } = request.body;
                const userId = request.userId;

                const expense = await prisma.expense.create({
                    data: {
                        amount,
                        category,
                        description,
                        userId,
                    },
                });

                reply.send({
                    expenses: {
                        id: expense.id,
                        amount: expense.amount,
                        category: expense.category,
                        description: expense.description,
                        createdAt: expense.createdAt,
                    },
                });
            } catch (err) {
                reply.status(400).send({ error: err.message });
            }
        },
    });

    fastify.delete("/expenses/:id", {
        preHandler: [fastify.authenticate],
        schema: deleteExpenseSchema,
        handler: async (request, reply) => {
            try {
                const id = parseInt(request.params.id);
                const userId = request.userId;

                const expense = await prisma.expense.findUnique({
                    where: { id },
                });

                if (!expense || expense.userId !== userId) {
                    return reply.status(404).send({
                        error: "Expense not found or unauthorized",
                    });
                }

                await prisma.expense.delete({ where: { id } });

                reply.send({ message: "Expense deleted" });
            } catch (err) {
                reply.status(400).send({ error: err.message });
            }
        },
    });
}
