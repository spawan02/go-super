import {
    createExpenseSchema,
    deleteExpenseSchema,
    getExpensesSchema,
} from "../schemas/expenseSchema.js";

export default async function (fastify) {
    fastify.get(
        "/expenses",
        {
            schema: getExpensesSchema,
            preHandler: [fastify.authenticate],
        },
        async (request, reply) => {
            try {
                const userId = request.userId;

                const expenses = await fastify.prisma.expense.findMany({
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
        }
    );

    fastify.post(
        "/expenses",
        {
            schema: createExpenseSchema,
            preHandler: fastify.authenticate,
        },
        async (request, reply) => {
            try {
                const { amount, category, description } = request.body;
                const userId = request.userId;

                const expense = await fastify.prisma.expense.create({
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
        }
    );

    fastify.delete(
        "/expenses/:id",
        {
            preHandler: fastify.authenticate,
            schema: deleteExpenseSchema,
        },
        async (request, reply) => {
            try {
                const id = parseInt(request.params.id);
                const userId = request.userId;

                const expense = await fastify.prisma.expense.findUnique({
                    where: { id },
                });

                if (!expense || expense.userId !== userId) {
                    return reply.status(404).send({
                        error: "Expense not found or unauthorized",
                    });
                }

                await fastify.prisma.expense.delete({ where: { id } });

                reply.send({ message: "Expense deleted" });
            } catch (err) {
                reply.status(400).send({ error: err.message });
            }
        }
    );
}
