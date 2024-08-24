const axios = require("axios")
const fs = require("fs")
const path = require("path")
const FormData = require("form-data")

// Use the nodemon file :D
const formData = new FormData()
const file = fs.readFileSync(path.join(__dirname, "joy.png"))
formData.append("files", file, "joy.png")
formData.append("files", file, "joy (2).png")

// Send the request
;(async () => {
  try {
    const res = await axios.post("http://localhost:3000/u", formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: "local LOCAL-TEST-AUTH-KEY",
      },
    })

    console.log("RESPONSE", res.data)
  } catch (err) {
    console.error("ERROR", err)
  }
})()
