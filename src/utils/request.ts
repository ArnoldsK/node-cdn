import { Request } from "express"
import { z } from "zod"

import { RequestAuth } from "../types"
import { config } from "../config"

export const getRequestAuth = (req: Request): RequestAuth => {
  const [client, token] = req.headers.authorization?.split(" ") ?? []

  // Fail hard if validation fails
  return z
    .object({
      client: z
        .string()
        .trim()
        .refine((name) => config.auth.clients.some((el) => el.name === name)),
      token: z.string().uuid(),
    })
    .parse({ client: client.toLowerCase(), token })
}

export const getRequestClient = (req: Request): string => {
  return getRequestAuth(req).client
}
