import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const env = z
  .object({
    APP_URL: z.string(),
    APP_PORT: z.string().regex(/\d+/),
    AUTH_TOKEN: z.string().uuid(),
  })
  .parse(process.env)

export const config = {
  app: {
    url: env.APP_URL,
    port: env.APP_PORT,
  },
  auth: {
    clients: ["flapjack"],
    token: env.AUTH_TOKEN,
  },
}
