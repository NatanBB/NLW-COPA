import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Natan Boos',
      email: 'natanboos@gmail.com',
      avatarUrl: 'https://github.com/natanbb.png',
    }
  });

  const pool = await prisma.pool.create({
    data: {
      title: 'Exemple Pool',
      code: 'BOL123',
      ownerId: user.id,

      participents: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T14:24:54.548Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-04T12:00:00.548Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          fistTeamPoints: 2,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main();