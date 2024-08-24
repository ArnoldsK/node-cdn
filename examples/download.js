const axios = require("axios")

// Send the request
;(async () => {
  try {
    const res = await axios.post(
      "http://localhost:3000/dl",
      [
        {
          url: "https://i.imgur.com/vxDT3VX.png",
          filename: "joy-imgur.png",
        },
      ],
      {
        headers: {
          Authorization: "flapjack LOCAL-TEST-AUTH-KEY",
        },
      },
    )

    console.log("RESPONSE", res.data)
  } catch (err) {
    console.error("ERROR", err)
  }
})()
