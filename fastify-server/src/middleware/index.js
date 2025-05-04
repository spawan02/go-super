import fastify from 'fastify';
import jwt from 'jsonwebtoken';
require('dotenv').config();

const JWT_PASSWORD = process.env.JWT_PASSWORD || 'password';  

fastify.decorate('authenticate', async function (request, reply) {
  const authorizationHeader = request.headers['authorization']; 
  const token = authorizationHeader?.split(' ')[1];

  if (!token) {
    return reply.code(403).send({ message: 'Invalid token' });
  }

  try {
    jwt.verify(token, JWT_PASSWORD, (err, decoded) => {
      if (err) {
        return reply.code(403).send({ message: err.message });
      }

      if (decoded) {
        request.userId = decoded.userId;
        return;
      } else {
        return reply.code(400).send({ message: 'Invalid token payload' });
      }
    });
  } catch (error) {
    reply.code(500).send({ message: 'Internal Server Error' });
  }
})

export default authenticate;
