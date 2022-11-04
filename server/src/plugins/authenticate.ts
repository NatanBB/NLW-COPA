import { FastifyRequest } from "fastify";

export async function authenticade(request: FastifyRequest) {
  await request.jwtVerify();
}