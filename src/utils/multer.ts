import multer from "multer"
import slugify from "slugify"
import { getClientDir } from "./file"

export const getClientMulter = (client: string) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, getClientDir(client))
    },
    filename: (_req, file, callback) => {
      callback(
        null,
        slugify(file.originalname, {
          trim: true,
        }),
      )
    },
  })

  // TODO add fileFilter to allow only sane types
  return multer({ storage })
}
