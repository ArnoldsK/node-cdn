import { z } from "zod"

import { Config } from "../types"
import jsonConfig from "../../config.json"

export const config: Config = z
  .object({
    app: z.object({
      url: z.string().url(),
      port: z.number(),
    }),
    auth: z.object({
      clients: z.array(
        z.object({
          name: z.string().toLowerCase(),
          token: z.string(),
        }),
      ),
    }),
  })
  .parse(jsonConfig)
