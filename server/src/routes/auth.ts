import { FastifyInstance } from "fastify"
import { z } from "zod"
import fetch from 'node-fetch';
import { prisma } from "../lib/prisma"
import { authenticade } from "../plugins/authenticate";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/me', {
    onRequest: [authenticade]
  },
    async (request) => {
      return { user: request.user }
    })

  fastify.post('/users', async (request) => {
    const createUserBody = z.object({
      access_token: z.string()
    })

    const { access_token } = createUserBody.parse(request.body);

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    // ya29.a0Aa4xrXOxULSsOj23KAyamnUC3ltnY9JhYjL2ouVUFY719-jEw7xTCzWrygAl_PkH9M75OBTulTxf0581loH8hS5RqwnNVOG3jKkiNPZCbNj1fp0eG8CRmuZJLvhm-B7gQkp4mTsv7y0ImcL4IxQRogwQ5VIgTgaCgYKAcUSARMSFQEjDvL9d7gr0jQsIu5XPFpmIhY4LA0165

    const userData = await userResponse.json();

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url()
    });

    const userInfo = userInfoSchema.parse(userData);

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id
      }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture
        }
      })
    }

    const token = fastify.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl
    }, {
      sub: user.id,
      expiresIn: '7 days'
    })

    return {
      token
    }
  })
}