
export default async function (fastify) {
  fastify.decorate('authenticate', async function (request, reply) {
    const authorizationHeader = request.headers['authorization']; 
    const token = authorizationHeader?.split(' ')[1];

    if (!token) {
      return reply.code(403).send({ message: 'Invalid token' });
    }

    try {

      const decoded = await fastify.jwt.verify(token);
      request.userId = decoded.userId
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  })
}