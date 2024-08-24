import fs from "fs"
import axios from "axios"
import * as stream from "stream"
import { promisify } from "util"

const finished = promisify(stream.finished)

import { config } from "../config"
import { FileResponse } from "../types"

export const getFileUrl = (client: string, filename: string): string => {
  const url = new URL(`/f/${client}/${filename}`, config.app.url)

  return url.toString()
}

export const getFileResponse = (
  client: string,
  filename: string,
): FileResponse => {
  return {
    filename,
    url: getFileUrl(client, filename),
  }
}

export const getClientDir = (client: string): string => {
  return `uploads/${client}/`
}

export const getClientFilenames = (client: string): string[] => {
  const dir = getClientDir(client)

  if (!fs.existsSync(dir)) {
    return []
  }

  return fs.readdirSync(dir)
}

export async function downloadFile(
  url: string,
  outputLocationPath: string,
): Promise<any> {
  const writer = fs.createWriteStream(outputLocationPath)
  return axios({
    method: "get",
    url,
    responseType: "stream",
  }).then((response) => {
    response.data.pipe(writer)
    return finished(writer)
  })
}
