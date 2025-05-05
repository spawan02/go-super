import fp from 'fastify-plugin'

export default fp( async(fastify)=>{
  fastify.decorate('authenticate', async function (request, reply) {
    const authorizationHeader = request.headers['authorization']; 
    const token = authorizationHeader?.split(' ')[1];
    // console.log(token)
    if (!token) {
      return reply.code(403).send({ message: 'Invalid token' });
    }

    try {
      console.log("here")
      const decoded = await fastify.jwt.verify(token);
      request.userId = decoded.userId
    } catch (error) {
      return reply.code(500).send({ message: 'Internal Server Error' });
    }
  })
})