import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticade } from "../plugins/authenticate"

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()

    return {
      count
    }
  })

  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticade]
  }, async (request, response) => {
    const createGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string()
    });

    const createGuessBody = z.object({
      fistTeamPoints: z.number(),
      secondTeamPoints: z.number()
    });

    const { poolId, gameId } = createGuessParams.parse(request.params);
    const { fistTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body);

    const participant = await prisma.participent.findUnique({
      where: {
        userId_poolId: {
          poolId,
          userId: request.user.sub
        }
      }
    });

    if (!participant) {
      return response.status(400).send({
        message: "You're not allowed to create a guess inside this pool."
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participentId_gameId: {
          participentId: participant.id,
          gameId
        }
      }
    });

    if (guess) {
      return response.status(400).send({
        message: "You already sent a guess to this game on this pool."
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      }
    })

    if (!game) {
      return response.status(400).send({
        message: "Game not found."
      })
    }

    if (game.date < new Date()) {
      return response.status(400).send({
        message: "You cannot send guesses after the game date."
      })
    }

    await prisma.guess.create({
      data: {
        gameId,
        participentId: participant.id,
        fistTeamPoints,
        secondTeamPoints
      }
    })

    return response.status(201).send();
  })
}