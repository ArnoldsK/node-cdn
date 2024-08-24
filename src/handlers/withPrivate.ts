import { Handler } from "express"

import { config } from "../config"
import { getRequestAuth } from "../utils/request"
import { RequestAuth } from "../types"

export const withPrivate: Handler = (req, res, next) => {
  let auth: RequestAuth
  try {
    auth = getRequestAuth(req)
  } catch (err) {
    return res.sendStatus(401)
  }

  // Basic comparison
  if (auth.token !== config.auth.token) {
    return res.sendStatus(403)
  }

  next()
}
