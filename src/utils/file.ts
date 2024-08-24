import fs from "fs"
import axios from "axios"
import * as stream from "stream"
import { promisify } from "util"

const finished = promisify(stream.finished)

import { config } from "../config"
import { FileResponse } from "../types"

export const getFileUrl = (filename: string): string => {
  const url = new URL(`/f/${filename}`, config.app.url)

  return url.toString()
}

export const getFileResponse = (filename: string): FileResponse => {
  return {
    filename,
    url: getFileUrl(filename),
  }
}

export const getClientDir = (client: string): string => {
  return `uploads/${client}/`
}

export const getClientFilenames = (client: string): string[] => {
  return fs.readdirSync(getClientDir(client))
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
