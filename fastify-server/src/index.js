import Fastify from 'fastify'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import expenseRoutes from './routes/expenses.js'
import prismaPlugin from './plugins/prisma.js'
import authPlugin from './plugins/auth.js'
import fastifyCors from "fastify-cors"

dotenv.config()
const fastify = Fastify({ logger: true })
fastify.register(fastifyCors, {
    origin: "*"
})
fastify.register(prismaPlugin)
fastify.register(require('fastify-jwt'), { secret: process.env.JWT_SECRET })
fastify.register(authPlugin)
fastify.register(authRoutes)
fastify.register(expenseRoutes)

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  fastify.log.info(`Server running at ${address}`)
})
