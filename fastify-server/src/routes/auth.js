import { comparePassword, hashPassword } from "../utils"
import { loginResponseSchema, signUpSchema } from "../schemas/loginSchema"


export default async function (fastify) {
  fastify.post('/register', signUpSchema, async (request, reply) => {
    const { email, password } = request.body
    const existingUser = await fastify.prisma.user.findUnique({where : {email}})
    if(existingUser) {
        return reply.code(400).send({
            message: 'User already exists'
        })
    } 

    const hashed = await hashPassword(password, 10)
    try{
        const user = await fastify.prisma.user.create({ 
            data: { 
                email, 
                password: hashed 
            } 
        });
    }catch(e){
        fastify.log.error(error)
        return reply.code(500).send({ message: 'Internal server error' })
    }
    reply.send({ 
        message: "user registered",  
        userId: user.id
    })
  })

  fastify.post('/login', loginResponseSchema, async (request, reply) => {
    const { email, password } = request.body;
    const user = await fastify.prisma.user.findUnique({ where: { email } })
    if (!user) return reply.code(400).send({ message: 'User not found' })

    const valid = await comparePassword(password, user.password)
    if (!valid) return reply.code(400).send({ message: 'Invalid password' })

    const token = fastify.jwt.sign({ userId: user.id })
    reply.send({ 
        token,
        user:{
            id: user.id,
            email: user.email
        }
     })
  })
}
