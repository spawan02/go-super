import jwt from 'jsonwebtoken';
require('dotenv').config();

const JWT_PASSWORD = process.env.JWT_PASSWORD || 'password';  


const verifyJwt = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export default async function (fastify) {
  fastify.decorate('authenticate', async function (request, reply) {
    const authorizationHeader = request.headers['authorization']; 
    const token = authorizationHeader?.split(' ')[1];

    if (!token) {
      return reply.code(403).send({ message: 'Invalid token' });
    }

    try {
      const decoded = await verifyJwt(token, JWT_PASSWORD);
      request.userId = decoded.userId
    } catch (error) {
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  })
}