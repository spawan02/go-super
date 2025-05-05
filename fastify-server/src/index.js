import Fastify from "fastify";
import fastifyJwt from '@fastify/jwt';
import fastifyCors from "@fastify/cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";
import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";

dotenv.config();
const fastify = Fastify({ logger: true });
fastify.register(fastifyCors, {
    origin: "*",
});
fastify.register(prismaPlugin);
fastify.register(authPlugin);
fastify.register(fastifyJwt, { secret: process.env.JWT_PASSWORD });
fastify.register(authRoutes, {prefix: "/api"});
fastify.register(expenseRoutes, {prefix: "/api"});

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    fastify.log.info(`Server running at ${address}`);
});
