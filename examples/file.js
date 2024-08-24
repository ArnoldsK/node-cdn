const axios = require("axios")

// Send the request
;(async () => {
  try {
    const res = await axios.get("http://localhost:3000/f/joy.png", {
      headers: {
        Authorization: "local LOCAL-TEST-AUTH-KEY",
      },
    })

    console.log("RESPONSE", res.data)
  } catch (err) {
    console.error("ERROR", err)
  }
})()
