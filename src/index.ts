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
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
)

// Upload
app.post("/u", withPrivate, withUpload, (req, res) => {
  const files = req.files ? Object.values(req.files) : []
  const client = getRequestClient(req)
  const data = files.map(({ filename }) => getFileResponse(client, filename))

  res.json(data)
})

// Download a remote file
app.post("/dl", withPrivate, async (req, res) => {
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

  const files = (
    await Promise.allSettled(
      body.data.map(async (item) => {
        await downloadFile(
          item.url,
          path.join(dir, slugify(item.filename, { trim: true })),
        )

        return getFileResponse(client, item.filename)
      }),
    )
  )
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((file) => !!file)

  res.json(files)
})

// All files
app.get("/f", withPrivate, (req, res) => {
  const client = getRequestClient(req)
  const filenames = getClientFilenames(client)

  res.json(filenames.map((filename) => getFileResponse(client, filename)))
})

// Single file
app.get("/f/:filename", withPrivate, (req, res) => {
  const client = getRequestClient(req)
  const filenames = getClientFilenames(client)

  const filename = req.params.filename
  if (!filenames.includes(filename)) {
    return res.sendStatus(404)
  }

  res.json(getFileResponse(client, filename))
})

// View a single file
app.get("/f/:client/:filename", (req, res) => {
  const client = req.params.client.toLowerCase()
  const filenames = getClientFilenames(client)

  const filename = req.params.filename
  if (!filenames.includes(filename)) {
    return res.sendStatus(404)
  }

  const dir = getClientDir(client)
  const file = path.join(dir, filename)

  res.sendFile(file, {
    root: process.cwd(),
  })
})

// Delete all files
app.delete("/f", withPrivate, (req, res) => {
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
app.delete("/f/:filename", withPrivate, (req, res) => {
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

// Fallback route
app.use((_req, res, _next) => {
  res.status(404)
})

app.listen(config.app.port, () => {
  console.log("Ready on", config.app.url, `(Port ${config.app.port})`)
})
