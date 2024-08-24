import { z } from "zod"

import { Config } from "../types"
import jsonConfig from "../../config.json"

export const config: Config = z
  .object({
    app: z.object({
      url: z.string().url().min(1),
      port: z.number().int().positive(),
    }),
    auth: z.object({
      clients: z.array(
        z.object({
          name: z.string().toLowerCase().min(1),
          token: z.string().min(1),
        }),
      ),
    }),
  })

  .parse(jsonConfig)
