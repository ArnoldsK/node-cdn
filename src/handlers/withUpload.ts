import { Handler } from "express"
import fs from "fs"

import { getRequestClient } from "../utils/request"
import { getClientMulter } from "../utils/multer"
import { getClientDir } from "../utils/file"

export const withUpload: Handler = (req, res, next) => {
  const client = getRequestClient(req)
  const upload = getClientMulter(client)

  const dir = getClientDir(client)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  return upload.array("files")(req, res, next)
}
