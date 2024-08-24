import express from "express"
import helmet from "helmet"
import cors from "cors"
import fs from "fs"
import path from "path"
import { z } from "zod"
import slugify from "slugify"

import { config } from "./config"
import { withPrivate } from "./handlers/withPrivate"
import { withUpload } from "./handlers/withUpload"
import {
  downloadFile,
  getClientDir,
  getClientFilenames,
  getFileResponse,
} from "./utils/file"
import { getRequestClient } from "./utils/request"
import bodyParser from "body-parser"

// #############################################################################
// Server
// #############################################################################
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(helmet())
app.use(withPrivate)

// Upload
app.post("/u", withUpload, (req, res) => {
  const files = req.files ? Object.values(req.files) : []
  const data = files.map(({ filename }) => getFileResponse(filename))

  res.json(data)
})

// Download a remote file
app.post("/dl", async (req, res) => {
  const body = z
    .array(
      z.object({
        url: z.string().url(),
        filename: z
          .string()
          .transform((value) => slugify(value, { trim: true })),
      }),
    )
    .safeParse(req.body)

  if (!body.success) {
    return res.sendStatus(400)
  }

  const client = getRequestClient(req)
  const dir = getClientDir(client)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  await Promise.all(
    body.data.map((item) =>
      downloadFile(
        item.url,
        path.join(dir, slugify(item.filename, { trim: true })),
      ),
    ),
  )

  res.json(body.data.map(({ filename }) => getFileResponse(filename)))
})

// All files
app.get("/f", (req, res) => {
  const client = getRequestClient(req)
  const filenames = getClientFilenames(client)

  res.json(filenames.map(getFileResponse))
})

// Single file
app.get("/f/:filename", (req, res) => {
  const client = getRequestClient(req)
  const filenames = getClientFilenames(client)

  const filename = req.params.filename
  if (!filenames.includes(filename)) {
    return res.sendStatus(404)
  }

  res.json(getFileResponse(filename))
})

// Delete all files
app.delete("/f", (req, res) => {
  const client = getRequestClient(req)
  const filenames = getClientFilenames(client)
  const dir = getClientDir(client)

  for (const filename of filenames) {
    fs.rmSync(path.join(dir, filename), {
      force: true,
    })
  }

  res.sendStatus(200)
})

// Delete a single files
app.delete("/f/:filename", (req, res) => {
  const client = getRequestClient(req)
  const filenames = getClientFilenames(client)

  const filename = req.params.filename
  if (!filenames.includes(filename)) {
    return res.sendStatus(404)
  }

  const file = path.join(getClientDir(client), filename)
  fs.rmSync(file, {
    force: true,
  })

  res.sendStatus(200)
})

app.listen(config.app.port, () => {
  console.log("Ready on", config.app.url, `(Port ${config.app.port})`)
})
